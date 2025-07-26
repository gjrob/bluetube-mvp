// server.js - Simplified version for Railway
require('dotenv').config();
import NodeMediaServer from 'node-media-server';
import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
// Simple health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'BlueTubeTV Streaming Backend Running',
    rtmp: 'rtmp://your-domain:1935/live',
    note: 'Append your stream key to the RTMP URL'
  });
});

// Media server configuration - simplified without transcoding for now
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8001,  // Changed from 8000 to avoid conflict
    allow_origin: '*',
    mediaroot: './media'
  }
};

// Create media server
const nms = new NodeMediaServer(config);

// Log RTMP events
nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath}`);
});

// Start Express server on Railway's PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Run media server
nms.run();

console.log('BlueTubeTV Streaming Backend Started');
console.log('RTMP Server listening on port 1935');
console.log('HTTP Server listening on port 8001');