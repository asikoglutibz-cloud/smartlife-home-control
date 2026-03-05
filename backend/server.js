const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'smartlife-dev-secret-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (for demo - use a real DB in production)
const users = [
  {
    id: '1',
    email: 'demo@smartlife.com',
    password: bcrypt.hashSync('demo123', 10),
    name: 'Demo User'
  }
];

const rooms = [
  { id: '1', name: 'Living Room', temperature: 22, humidity: 45, devices: ['1', '2', '3'] },
  { id: '2', name: 'Bedroom', temperature: 20, humidity: 50, devices: ['4', '5'] },
  { id: '3', name: 'Kitchen', temperature: 23, humidity: 40, devices: ['6', '7'] },
  { id: '4', name: 'Bathroom', temperature: 24, humidity: 60, devices: ['8'] },
  { id: '5', name: 'Office', temperature: 21, humidity: 48, devices: ['9', '10'] }
];

const devices = [
  { id: '1', name: 'Main Light', type: 'light', room: 'Living Room', status: true, brightness: 80 },
  { id: '2', name: 'TV', type: 'entertainment', room: 'Living Room', status: false },
  { id: '3', name: 'AC', type: 'climate', room: 'Living Room', status: true, temperature: 22 },
  { id: '4', name: 'Bedroom Light', type: 'light', room: 'Bedroom', status: false, brightness: 50 },
  { id: '5', name: 'Fan', type: 'climate', room: 'Bedroom', status: false },
  { id: '6', name: 'Kitchen Light', type: 'light', room: 'Kitchen', status: true, brightness: 100 },
  { id: '7', name: 'Coffee Maker', type: 'appliance', room: 'Kitchen', status: false },
  { id: '8', name: 'Bathroom Heater', type: 'climate', room: 'Bathroom', status: false },
  { id: '9', name: 'Desk Lamp', type: 'light', room: 'Office', status: true, brightness: 70 },
  { id: '10', name: 'Monitor', type: 'entertainment', room: 'Office', status: true }
];

const scenes = [
  { id: '1', name: 'Good Morning', icon: '🌅', devices: { '1': { status: true, brightness: 100 }, '6': { status: true }, '3': { status: true, temperature: 23 } } },
  { id: '2', name: 'Movie Night', icon: '🎬', devices: { '1': { status: false }, '2': { status: true }, '9': { status: true, brightness: 30 } } },
  { id: '3', name: 'Away Mode', icon: '🏠', devices: { '1': { status: false }, '2': { status: false }, '3': { status: false } } },
  { id: '4', name: 'Good Night', icon: '🌙', devices: { '1': { status: false }, '4': { status: false }, '9': { status: false } } },
  { id: '5', name: 'Party Mode', icon: '🎉', devices: { '1': { status: true, brightness: 50 }, '2': { status: true }, '6': { status: true } } }
];

const securityState = {
  armed: false,
  status: 'disarmed',
  cameras: [
    { id: '1', name: 'Front Door', online: true, recording: false },
    { id: '2', name: 'Backyard', online: true, recording: false },
    { id: '3', name: 'Garage', online: false, recording: false }
  ],
  events: [
    { id: '1', type: 'motion', location: 'Front Door', time: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', type: 'door_opened', location: 'Garage', time: new Date(Date.now() - 7200000).toISOString() }
  ]
};

const energyData = {
  currentUsage: 2.4,
  todayUsage: 18.5,
  cost: 0.12,
  hourlyUsage: [1.2, 1.5, 2.1, 2.8, 3.2, 2.9, 2.4, 2.1, 1.8, 1.5, 1.3, 1.1],
  categoryBreakdown: { lighting: 25, climate: 40, entertainment: 20, appliances: 15 }
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const user = {
    id: String(users.length + 1),
    email,
    password: bcrypt.hashSync(password, 10),
    name
  };
  users.push(user);
  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name });
});

// Rooms routes
app.get('/api/rooms', authMiddleware, (req, res) => {
  res.json(rooms);
});

app.get('/api/rooms/:id', authMiddleware, (req, res) => {
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

// Devices routes
app.get('/api/devices', authMiddleware, (req, res) => {
  res.json(devices);
});

app.get('/api/devices/:id', authMiddleware, (req, res) => {
  const device = devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
});

app.patch('/api/devices/:id', authMiddleware, (req, res) => {
  const device = devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  
  Object.assign(device, req.body);
  io.emit('deviceUpdated', device);
  res.json(device);
});

app.post('/api/devices/:id/toggle', authMiddleware, (req, res) => {
  const device = devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  
  device.status = !device.status;
  io.emit('deviceUpdated', device);
  res.json(device);
});

// Scenes routes
app.get('/api/scenes', authMiddleware, (req, res) => {
  res.json(scenes);
});

app.post('/api/scenes/:id/activate', authMiddleware, (req, res) => {
  const scene = scenes.find(s => s.id === req.params.id);
  if (!scene) return res.status(404).json({ error: 'Scene not found' });
  
  // Apply scene to devices
  Object.entries(scene.devices).forEach(([deviceId, state]) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      Object.assign(device, state);
      io.emit('deviceUpdated', device);
    }
  });
  
  io.emit('sceneActivated', scene);
  res.json({ success: true, scene });
});

// Energy routes
app.get('/api/energy', authMiddleware, (req, res) => {
  res.json(energyData);
});

// Security routes
app.get('/api/security', authMiddleware, (req, res) => {
  res.json(securityState);
});

app.post('/api/security/system/:status', authMiddleware, (req, res) => {
  const { status } = req.params;
  securityState.armed = status === 'armed';
  securityState.status = status;
  io.emit('securityUpdated', securityState);
  res.json(securityState);
});

// Dashboard route
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({
    devices: devices.filter(d => d.status).length,
    totalDevices: devices.length,
    activeScenes: scenes.length,
    energyUsage: energyData.currentUsage,
    securityArmed: securityState.armed,
    rooms: rooms.length
  });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulated real-time updates
setInterval(() => {
  // Random energy fluctuation
  energyData.currentUsage = Math.max(0.5, energyData.currentUsage + (Math.random() - 0.5) * 0.3);
  io.emit('energyUpdate', energyData);
}, 5000);

server.listen(PORT, () => {
  console.log(`SmartLife Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
