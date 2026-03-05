import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Lightbulb, 
  Zap, 
  Thermometer, 
  Droplets, 
  Home, 
  Shield, 
  ChevronRight,
  Power,
  Sun,
  Moon,
  Film,
  Music,
  DoorOpen
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardData, Device, Scene, Room } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const sceneIcons: Record<string, React.ElementType> = {
  sun: Sun,
  moon: Moon,
  film: Film,
  music: Music,
  'door-open': DoorOpen
};

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for real-time updates
    const handleDeviceUpdate = (event: CustomEvent<Device>) => {
      setDevices(prev => prev.map(d => d.id === event.detail.id ? event.detail : d));
    };

    const handleSceneActivated = (event: CustomEvent<Scene>) => {
      setScenes(prev => prev.map(s => ({ ...s, active: s.id === event.detail.id })));
    };

    window.addEventListener('deviceUpdated', handleDeviceUpdate as EventListener);
    window.addEventListener('sceneActivated', handleSceneActivated as EventListener);

    return () => {
      window.removeEventListener('deviceUpdated', handleDeviceUpdate as EventListener);
      window.removeEventListener('sceneActivated', handleSceneActivated as EventListener);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, devicesRes, scenesRes, roomsRes] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard`),
        axios.get(`${API_URL}/api/devices`),
        axios.get(`${API_URL}/api/scenes`),
        axios.get(`${API_URL}/api/rooms`)
      ]);

      setDashboardData(dashboardRes.data);
      setDevices(devicesRes.data);
      setScenes(scenesRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = async (deviceId: number) => {
    try {
      await axios.post(`${API_URL}/api/devices/${deviceId}/toggle`);
    } catch (error) {
      console.error('Failed to toggle device:', error);
    }
  };

  const activateScene = async (sceneId: number) => {
    try {
      await axios.post(`${API_URL}/api/scenes/${sceneId}/activate`);
    } catch (error) {
      console.error('Failed to activate scene:', error);
    }
  };

  const updateDeviceBrightness = async (deviceId: number, brightness: number) => {
    try {
      await axios.patch(`${API_URL}/api/devices/${deviceId}`, { brightness });
    } catch (error) {
      console.error('Failed to update brightness:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff]" />
      </div>
    );
  }

  const activeLights = devices.filter(d => d.type === 'light' && d.status);
  const favoriteDevices = devices.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-400">Welcome back to {user?.homeName}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#141414] border-white/5 hover:border-[#00d4ff]/30 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Devices</p>
                    <p className="text-2xl font-bold text-white">{dashboardData?.stats.activeDevices || 0}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center group-hover:bg-[#00d4ff]/20 transition-colors">
                    <Power className="w-5 h-5 text-[#00d4ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5 hover:border-[#00ff88]/30 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Power Usage</p>
                    <p className="text-2xl font-bold text-white">{dashboardData?.stats.totalPower || 0}W</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center group-hover:bg-[#00ff88]/20 transition-colors">
                    <Zap className="w-5 h-5 text-[#00ff88]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5 hover:border-[#ffaa00]/30 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Temperature</p>
                    <p className="text-2xl font-bold text-white">{dashboardData?.stats.temperature || 71}°F</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#ffaa00]/10 flex items-center justify-center group-hover:bg-[#ffaa00]/20 transition-colors">
                    <Thermometer className="w-5 h-5 text-[#ffaa00]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5 hover:border-[#00d4ff]/30 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Humidity</p>
                    <p className="text-2xl font-bold text-white">{dashboardData?.stats.humidity || 45}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center group-hover:bg-[#00d4ff]/20 transition-colors">
                    <Droplets className="w-5 h-5 text-[#00d4ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Scenes */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Quick Scenes</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff]/80">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {scenes.slice(0, 5).map((scene) => {
                      const Icon = sceneIcons[scene.icon] || Sun;
                      return (
                        <button
                          key={scene.id}
                          onClick={() => activateScene(scene.id)}
                          className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
                            scene.active
                              ? 'bg-[#00d4ff]/20 border-[#00d4ff]'
                              : 'bg-[#1a1a1a] border-white/5 hover:border-[#00d4ff]/50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${scene.active ? 'text-[#00d4ff]' : 'text-gray-400 group-hover:text-[#00d4ff]'}`} />
                          <p className={`text-sm font-medium ${scene.active ? 'text-white' : 'text-gray-300'}`}>
                            {scene.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Devices */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Favorite Devices</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff]/80">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {favoriteDevices.map((device) => (
                      <div
                        key={device.id}
                        className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-[#00d4ff]/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              device.status ? 'bg-[#00d4ff]/20' : 'bg-[#2a2a2a]'
                            }`}>
                              <Lightbulb className={`w-5 h-5 ${device.status ? 'text-[#00d4ff]' : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <p className="text-white font-medium">{device.name}</p>
                              <p className="text-gray-500 text-sm">
                                {rooms.find(r => r.id === device.roomId)?.name}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={device.status}
                            onCheckedChange={() => toggleDevice(device.id)}
                            className="data-[state=checked]:bg-[#00d4ff]"
                          />
                        </div>
                        {device.type === 'light' && device.status && (
                          <div className="pt-2">
                            <Slider
                              value={[device.brightness || 50]}
                              onValueChange={(value) => updateDeviceBrightness(device.id, value[0])}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Brightness</span>
                              <span className="text-xs text-gray-400">{device.brightness}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rooms Overview */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Rooms</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff]/80">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-[#00d4ff]/30 transition-all cursor-pointer group"
                      >
                        <Home className="w-6 h-6 text-gray-400 group-hover:text-[#00d4ff] mb-2 transition-colors" />
                        <p className="text-white font-medium text-sm">{room.name}</p>
                        <p className="text-gray-500 text-xs">{room.deviceCount} devices</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Thermometer className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-400">{room.temperature}°F</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Lights */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-[#ffaa00]" />
                    Active Lights ({activeLights.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeLights.length > 0 ? (
                    <div className="space-y-3">
                      {activeLights.slice(0, 5).map((light) => (
                        <div key={light.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
                          <div>
                            <p className="text-white text-sm">{light.name}</p>
                            <p className="text-gray-500 text-xs">{light.brightness}% brightness</p>
                          </div>
                          <div 
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: light.color || '#ffffff' }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No lights are currently on</p>
                  )}
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-[#00ff88]" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">System Status</span>
                      <span className="px-2 py-1 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-xs font-medium">
                        Armed
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Doors</span>
                      <span className="text-white text-sm">All Locked</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Cameras</span>
                      <span className="text-white text-sm">3 Online</span>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                      View Security Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.recentActivity?.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-[#00ff88]' :
                          activity.type === 'warning' ? 'bg-[#ffaa00]' :
                          activity.type === 'error' ? 'bg-[#ff4444]' :
                          'bg-[#00d4ff]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.event}</p>
                          <p className="text-gray-500 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
