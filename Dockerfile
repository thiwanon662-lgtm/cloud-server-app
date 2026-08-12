# Production Dockerfile for 24/7 Cloud Node.js Server
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package definition
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose server port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["node", "server.js"]
