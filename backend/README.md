# SmartLife Backend API

This is the backend API for the SmartLife Home Control application.

## Features

- JWT Authentication
- Device Management
- Room Control
- Scene Automation
- Energy Monitoring
- Security System
- Real-time updates via Socket.IO

## Deployment Instructions

### Deploy to Render (Free)

1. Create a free account at [Render](https://render.com)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository or use "Deploy from directory"
4. Configure the service:
   - **Name**: smartlife-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   - `NODE_ENV`: production
   - `JWT_SECRET`: (generate a secure random string)
6. Click "Create Web Service"

### Deploy to Railway (Free)

1. Create a free account at [Railway](https://railway.app)
2. Click "New Project" and select "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect the Node.js app
5. Add environment variables in the Variables tab
6. Deploy!

### Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start

# The server will run on http://localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register new account
- `GET /api/auth/me` - Get current user info

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room details with devices

### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device details
- `PATCH /api/devices/:id` - Update device
- `POST /api/devices/:id/toggle` - Toggle device on/off

### Scenes
- `GET /api/scenes` - Get all scenes
- `POST /api/scenes/:id/activate` - Activate a scene

### Energy
- `GET /api/energy` - Get energy data and statistics

### Security
- `GET /api/security` - Get security status
- `POST /api/security/system/:status` - Change system status

### Dashboard
- `GET /api/dashboard` - Get dashboard summary

### Health Check
- `GET /health` - Health check endpoint

## Default Demo Account

- Email: `demo@smartlife.com`
- Password: `demo123`

## WebSocket Events

The server emits real-time updates via Socket.IO:

- `deviceUpdated` - When a device state changes
- `sceneActivated` - When a scene is activated
- `securityUpdated` - When security status changes
- `energyUpdate` - Periodic energy usage updates
- `sensorTriggered` - When a sensor detects activity

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment mode
