# Dockerfile for BlueTubeTV Independent Backend
FROM node:18-alpine

# Install FFmpeg for video processing
RUN apk add --no-cache ffmpeg

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Create media directory for HLS segments
RUN mkdir -p media

# Expose ports
EXPOSE 3001 1935 8000

# Start the application
CMD ["npm", "start"]