import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Home, 
  Thermometer, 
  Droplets, 
  Lightbulb, 
  ChevronRight,
  Plus
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import type { Room, Device } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const roomIcons: Record<string, React.ElementType> = {
  sofa: Home,
  utensils: Home,
  bed: Home,
  bath: Home,
  laptop: Home,
  car: Home,
  tree: Home
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomDevices, setRoomDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    const handleDeviceUpdate = (event: CustomEvent<Device>) => {
      setRoomDevices(prev => prev.map(d => d.id === event.detail.id ? event.detail : d));
    };

    window.addEventListener('deviceUpdated', handleDeviceUpdate as EventListener);
    return () => window.removeEventListener('deviceUpdated', handleDeviceUpdate as EventListener);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomDetails = async (room: Room) => {
    try {
      const response = await axios.get(`${API_URL}/api/rooms/${room.id}`);
      setSelectedRoom(response.data);
      setRoomDevices(response.data.devices || []);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
    }
  };

  const toggleDevice = async (deviceId: number) => {
    try {
      await axios.post(`${API_URL}/api/devices/${deviceId}/toggle`);
    } catch (error) {
      console.error('Failed to toggle device:', error);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Rooms</h1>
              <p className="text-gray-400">Manage devices by room</p>
            </div>
            <Button className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const Icon = roomIcons[room.icon] || Home;
              const activeDevices = room.deviceCount > 0 ? Math.floor(Math.random() * room.deviceCount) : 0;
              
              return (
                <Dialog key={room.id}>
                  <DialogTrigger asChild>
                    <Card 
                      className="bg-[#141414] border-white/5 hover:border-[#00d4ff]/30 transition-all cursor-pointer group overflow-hidden"
                      onClick={() => fetchRoomDetails(room)}
                    >
                      <div className="h-32 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-16 h-16 text-gray-700 group-hover:text-[#00d4ff]/30 transition-colors" />
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="px-2 py-1 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium">
                            {activeDevices}/{room.deviceCount} Active
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{room.name}</h3>
                            <p className="text-gray-500 text-sm">{room.deviceCount} devices</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#00d4ff] group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <div className="flex items-center mt-4 space-x-4">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-4 h-4 text-[#ffaa00]" />
                            <span className="text-gray-400 text-sm">{room.temperature}°F</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Droplets className="w-4 h-4 text-[#00d4ff]" />
                            <span className="text-gray-400 text-sm">{room.humidity}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-[#141414] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white text-2xl">{selectedRoom?.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-5 h-5 text-[#ffaa00]" />
                            <span className="text-white">{selectedRoom?.temperature}°F</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Droplets className="w-5 h-5 text-[#00d4ff]" />
                            <span className="text-white">{selectedRoom?.humidity}%</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-[#00d4ff] text-black">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Device
                        </Button>
                      </div>

                      <h4 className="text-gray-400 text-sm mb-3">Devices ({roomDevices.length})</h4>
                      
                      <div className="space-y-3">
                        {roomDevices.map((device) => (
                          <div
                            key={device.id}
                            className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5"
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
                                  <p className="text-gray-500 text-sm capitalize">{device.type}</p>
                                </div>
                              </div>
                              <Switch
                                checked={device.status}
                                onCheckedChange={() => toggleDevice(device.id)}
                                className="data-[state=checked]:bg-[#00d4ff]"
                              />
                            </div>
                            
                            {device.type === 'light' && device.status && (
                              <div className="pt-2 border-t border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-400 text-sm">Brightness</span>
                                  <span className="text-white text-sm">{device.brightness}%</span>
                                </div>
                                <Slider
                                  value={[device.brightness || 50]}
                                  onValueChange={(value) => updateDeviceBrightness(device.id, value[0])}
                                  max={100}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            )}
                            
                            {device.power !== undefined && (
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                <span className="text-gray-400 text-sm">Power Usage</span>
                                <span className="text-[#00ff88] text-sm">{device.power}W</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
