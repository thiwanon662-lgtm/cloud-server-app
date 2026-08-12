const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = Date.now();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for demo API
let itemsStore = [
  { id: 1, name: 'Cloud Server Instance', category: 'Infrastructure', status: 'Active', createdAt: new Date().toISOString() },
  { id: 2, name: 'Database Connection Pool', category: 'Database', status: 'Healthy', createdAt: new Date().toISOString() },
  { id: 3, name: 'Background Cron Job', category: 'Automation', status: 'Running', createdAt: new Date().toISOString() }
];

let requestCounter = 0;
app.use((req, res, next) => {
  requestCounter++;
  next();
});

// API Routes

// Health check endpoint (Used by Cloud services like Cloud Run / Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000)
  });
});

// Server system status & metrics
app.get('/api/status', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const processMemory = process.memoryUsage();

  res.json({
    serverName: 'Cloud-Node-Server',
    status: 'ONLINE 24/7',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    totalRequestsHandled: requestCounter,
    environment: process.env.NODE_ENV || 'production',
    system: {
      platform: os.platform(),
      architecture: os.arch(),
      nodeVersion: process.version,
      cpuCount: os.cpus().length,
      memory: {
        totalMB: Math.round(totalMem / (1024 * 1024)),
        freeMB: Math.round(freeMem / (1024 * 1024)),
        usedMB: Math.round(usedMem / (1024 * 1024)),
        processHeapUsedMB: Math.round(processMemory.heapUsed / (1024 * 1024))
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Sample CRUD API - GET Items
app.get('/api/items', (req, res) => {
  res.json({
    success: true,
    count: itemsStore.length,
    data: itemsStore
  });
});

// Sample CRUD API - POST Item
app.post('/api/items', (req, res) => {
  const { name, category, status } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }

  const newItem = {
    id: itemsStore.length > 0 ? Math.max(...itemsStore.map(i => i.id)) + 1 : 1,
    name: name.trim(),
    category: category ? category.trim() : 'General',
    status: status ? status.trim() : 'Active',
    createdAt: new Date().toISOString()
  };

  itemsStore.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

// Sample CRUD API - DELETE Item
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const initialLength = itemsStore.length;
  itemsStore = itemsStore.filter(i => i.id !== itemId);

  if (itemsStore.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }

  res.json({ success: true, message: `Item #${itemId} deleted successfully` });
});

// Echo / Tester endpoint
app.post('/api/echo', (req, res) => {
  res.json({
    receivedAt: new Date().toISOString(),
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    }
  });
});

// Fallback to SPA index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  🚀 24/7 Cloud Server is running on port ${PORT}`);
  console.log(`  🌐 Local Access: http://localhost:${PORT}`);
  console.log(`  📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  📊 System Status: http://localhost:${PORT}/api/status`);
  console.log(`=================================================`);
});
