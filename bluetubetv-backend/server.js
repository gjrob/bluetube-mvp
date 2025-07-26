// server.js - Complete Independent Streaming Backend for Railway
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const NodeMediaServer = require('node-media-server');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);

// CORS for your Vercel frontend
const corsOptions = {
  origin: [
    'https://bluetubetv.live',
    'https://*.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO with CORS
const io = socketIo(server, {
  cors: corsOptions
});

// In-memory storage (replace with your Postgres later)
const activeStreams = new Map();
const streamers = new Map();
const chatMessages = new Map();
const viewers = new Map();

// Create media directory for HLS files
const mediaDir = './media';
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Node Media Server Configuration - YOUR OWN RTMP SERVER
const nmsConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        hlsKeep: true
      }
    ]
  }
};

const nms = new NodeMediaServer(nmsConfig);

// RTMP Event Handlers - No External Services!
nms.on('preConnect', (id, args) => {
  console.log(`[RTMP] Connection attempt: ${id}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log(`[RTMP] Publish attempt: ${id} to ${StreamPath}`);
  
  // Extract stream key from path: /live/STREAM_KEY
  const streamKey = StreamPath.split('/').pop();
  
  // Validate stream key (connect to your database here)
  if (!streamKey || streamKey.length < 10) {
    console.log(`[RTMP] Invalid stream key: ${streamKey}`);
    // Reject the stream
    return;
  }
  
  // Stream is valid - store in our system
  const streamData = {
    id: uuidv4(),
    streamKey: streamKey,
    streamPath: StreamPath,
    rtmpId: id,
    status: 'live',
    startTime: new Date(),
    viewers: 0,
    title: `Live Stream - ${streamKey.substring(0, 8)}`,
    hlsUrl: `${process.env.RAILWAY_PUBLIC_DOMAIN || 'http://localhost'}:8000/live/${streamKey}/index.m3u8`
  };
  
  activeStreams.set(streamKey, streamData);
  
  // Notify all connected clients
  io.emit('stream_started', {
    streamKey: streamKey,
    title: streamData.title,
    hlsUrl: streamData.hlsUrl,
    startTime: streamData.startTime
  });
  
  console.log(`[STREAM] Live: ${streamKey}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/').pop();
  
  if (activeStreams.has(streamKey)) {
    // Notify clients stream ended
    io.emit('stream_ended', { streamKey: streamKey });
    
    // Clean up
    activeStreams.delete(streamKey);
    if (chatMessages.has(streamKey)) {
      chatMessages.delete(streamKey);
    }
    
    console.log(`[STREAM] Ended: ${streamKey}`);
  }
});

// Socket.IO for Real-time Features
io.on('connection', (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);
  
  // Join a stream room
  socket.on('join_stream', (data) => {
    const { streamKey, username } = data;
    
    if (!activeStreams.has(streamKey)) {
      socket.emit('error', { message: 'Stream not found' });
      return;
    }
    
    socket.join(streamKey);
    
    // Track viewer
    if (!viewers.has(streamKey)) {
      viewers.set(streamKey, new Set());
    }
    viewers.get(streamKey).add(socket.id);
    
    // Update viewer count
    const stream = activeStreams.get(streamKey);
    stream.viewers = viewers.get(streamKey).size;
    activeStreams.set(streamKey, stream);
    
    // Send viewer count to all in room
    io.to(streamKey).emit('viewer_count', { 
      count: stream.viewers 
    });
    
    // Send chat history
    if (chatMessages.has(streamKey)) {
      socket.emit('chat_history', chatMessages.get(streamKey));
    }
    
    console.log(`[VIEWER] ${username} joined ${streamKey} (${stream.viewers} viewers)`);
  });
  
  // Chat message
  socket.on('chat_message', (data) => {
    const { streamKey, username, message } = data;
    
    if (!activeStreams.has(streamKey)) return;
    
    const chatMessage = {
      id: uuidv4(),
      username: username,
      message: message,
      timestamp: new Date(),
      type: 'message'
    };
    
    // Store message
    if (!chatMessages.has(streamKey)) {
      chatMessages.set(streamKey, []);
    }
    const messages = chatMessages.get(streamKey);
    messages.push(chatMessage);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.shift();
    }
    
    // Broadcast to all viewers
    io.to(streamKey).emit('new_chat_message', chatMessage);
  });
  
  // Tip handling
  socket.on('send_tip', (data) => {
    const { streamKey, username, amount, message } = data;
    
    if (!activeStreams.has(streamKey)) return;
    
    const tipMessage = {
      id: uuidv4(),
      username: username,
      amount: amount,
      message: message || '',
      timestamp: new Date(),
      type: 'tip'
    };
    
    // Store as chat message
    if (!chatMessages.has(streamKey)) {
      chatMessages.set(streamKey, []);
    }
    chatMessages.get(streamKey).push(tipMessage);
    
    // Broadcast tip notification
    io.to(streamKey).emit('new_tip', tipMessage);
    
    console.log(`[TIP] ${username} tipped $${amount} to ${streamKey}`);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove from all viewer counts
    for (const [streamKey, viewerSet] of viewers.entries()) {
      if (viewerSet.has(socket.id)) {
        viewerSet.delete(socket.id);
        
        // Update count
        if (activeStreams.has(streamKey)) {
          const stream = activeStreams.get(streamKey);
          stream.viewers = viewerSet.size;
          activeStreams.set(streamKey, stream);
          
          io.to(streamKey).emit('viewer_count', { 
            count: stream.viewers 
          });
        }
      }
    }
    
    console.log(`[SOCKET] User disconnected: ${socket.id}`);
  });
});

// API Endpoints - Your Own Platform

// Generate stream key for users
app.post('/api/generate-stream-key', (req, res) => {
  const streamKey = uuidv4().replace(/-/g, '').substring(0, 16);
  const rtmpUrl = `rtmp://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost'}:1935/live/${streamKey}`;
  
  // Store in your database here
  streamers.set(streamKey, {
    key: streamKey,
    created: new Date(),
    used: false
  });
  
  res.json({
    streamKey: streamKey,
    rtmpUrl: rtmpUrl,
    instructions: {
      obs: {
        server: `rtmp://${process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost'}:1935/live`,
        key: streamKey
      },
      mobile: {
        url: rtmpUrl,
        note: "Use any RTMP streaming app"
      }
    }
  });
});

// Get active streams
app.get('/api/streams', (req, res) => {
  const streams = Array.from(activeStreams.values()).map(stream => ({
    streamKey: stream.streamKey,
    title: stream.title,
    viewers: stream.viewers,
    startTime: stream.startTime,
    hlsUrl: stream.hlsUrl,
    status: 'live'
  }));
  
  res.json(streams);
});

// Get specific stream info
app.get('/api/stream/:streamKey', (req, res) => {
  const { streamKey } = req.params;
  
  if (!activeStreams.has(streamKey)) {
    return res.status(404).json({ error: 'Stream not found' });
  }
  
  const stream = activeStreams.get(streamKey);
  res.json({
    streamKey: stream.streamKey,
    title: stream.title,
    viewers: stream.viewers,
    startTime: stream.startTime,
    hlsUrl: stream.hlsUrl,
    status: 'live'
  });
});

// Serve HLS files
app.use('/hls', express.static('./media'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeStreams: activeStreams.size,
    totalViewers: Array.from(viewers.values()).reduce((sum, set) => sum + set.size, 0),
    uptime: process.uptime()
  });
});

// Start servers
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 BlueTubeTV Independent Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for real-time features`);
  
  // Log RTMP info
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost';
  console.log(`\n🎬 RTMP Server: rtmp://${domain}:1935/live`);
  console.log(`🌐 HLS Server: http://${domain}:8000`);
  console.log(`\n✅ NO EXTERNAL DEPENDENCIES!`);
  console.log(`✅ Users stream directly to YOUR platform!`);
  console.log(`✅ You control everything!`);
});

// Start Node Media Server
nms.run();

module.exports = { app, server, nms };