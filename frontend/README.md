# SmartLife Home Control

A modern, beautiful smart home control dashboard built with React, TypeScript, and Tailwind CSS.

![SmartLife Dashboard](https://your-screenshot-url.com)

## Features

### Dashboard
- Real-time overview of all connected devices
- Quick stats (active devices, power usage, temperature, humidity)
- One-touch scene activation
- Favorite devices with brightness controls
- Room overview with device counts
- Recent activity feed

### Room Management
- View all rooms with device counts
- Room-specific device controls
- Temperature and humidity monitoring
- Quick device toggles per room

### Device Control
- Grid and list view options
- Filter by device type
- Search functionality
- Real-time device status updates
- Brightness controls for lights
- Power usage monitoring

### Scenes & Automation
- Pre-configured scenes (Good Morning, Leaving Home, Movie Night, Good Night, Party Mode)
- One-touch scene activation
- Custom scene creation support
- Scene preview with action list

### Energy Monitoring
- Real-time power usage tracking
- Hourly usage charts
- Energy breakdown by category
- Cost estimation
- Savings comparison
- Peak usage hours

### Security Dashboard
- System arming/disarming
- Live camera feeds (simulated)
- Recent security events
- Door and window status
- Motion detection alerts
- Emergency actions

### Settings
- Profile management
- Home configuration
- Notification preferences
- Appearance settings (Dark/Light mode)
- Accent color selection

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Real-time**: Socket.IO client
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/smartlife.git
cd smartlife/app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file
```bash
VITE_API_URL=http://localhost:3001
```

4. Start the development server
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Demo Account

- Email: `demo@smartlife.com`
- Password: `demo123`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
├── index.css         # Global styles
└── main.tsx          # Entry point
```

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: '#00d4ff',
  success: '#00ff88',
  warning: '#ffaa00',
  danger: '#ff4444',
}
```

### Adding New Device Types

1. Add the device type to `src/types/index.ts`
2. Add an icon mapping in `src/pages/DevicesPage.tsx`
3. Add device controls in the device card component

## Deployment

### Deploy Frontend

The frontend can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your GitHub repo
- **GitHub Pages**: Use the provided workflow

### Deploy Backend

See the backend README for deployment instructions.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
