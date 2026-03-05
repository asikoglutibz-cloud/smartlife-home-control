import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Lightbulb, 
  Thermometer, 
  Tv, 
  Fan, 
  Shield, 
  Lock,
  Music,
  Coffee,
  Power,
  Search,
  Grid3X3,
  List
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { Device, Room } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const deviceIcons: Record<string, React.ElementType> = {
  light: Lightbulb,
  climate: Thermometer,
  entertainment: Tv,
  fan: Fan,
  security: Shield,
  door: Lock,
  appliance: Coffee,
  curtain: Music
};

const deviceTypeLabels: Record<string, string> = {
  light: 'Lighting',
  climate: 'Climate',
  entertainment: 'Entertainment',
  fan: 'Fans',
  security: 'Security',
  door: 'Doors',
  appliance: 'Appliances',
  curtain: 'Curtains'
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    const handleDeviceUpdate = (event: CustomEvent<Device>) => {
      setDevices(prev => prev.map(d => d.id === event.detail.id ? event.detail : d));
    };

    window.addEventListener('deviceUpdated', handleDeviceUpdate as EventListener);
    return () => window.removeEventListener('deviceUpdated', handleDeviceUpdate as EventListener);
  }, []);

  const fetchData = async () => {
    try {
      const [devicesRes, roomsRes] = await Promise.all([
        axios.get(`${API_URL}/api/devices`),
        axios.get(`${API_URL}/api/rooms`)
      ]);
      setDevices(devicesRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  const updateDevice = async (deviceId: number, updates: Partial<Device>) => {
    try {
      await axios.patch(`${API_URL}/api/devices/${deviceId}`, updates);
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rooms.find(r => r.id === device.roomId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || device.type === selectedType;
    return matchesSearch && matchesType;
  });

  const deviceTypes = ['all', ...Array.from(new Set(devices.map(d => d.type)))];

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Devices</h1>
              <p className="text-gray-400">Manage all your smart devices</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Power className="w-4 h-4 mr-2" />
                All Off
              </Button>
              <Button className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black">
                Add Device
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#141414] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Tabs value={selectedType} onValueChange={setSelectedType}>
                <TabsList className="bg-[#141414] border border-white/10">
                  {deviceTypes.slice(0, 4).map(type => (
                    <TabsTrigger 
                      key={type} 
                      value={type}
                      className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black capitalize"
                    >
                      {type === 'all' ? 'All' : deviceTypeLabels[type] || type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-none ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`rounded-none ${viewMode === 'list' ? 'bg-white/10' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Device Stats */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary" className="bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30">
              Total: {devices.length}
            </Badge>
            <Badge variant="secondary" className="bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30">
              Active: {devices.filter(d => d.status).length}
            </Badge>
            <Badge variant="secondary" className="bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/30">
              Offline: {devices.filter(d => !d.status).length}
            </Badge>
          </div>

          {/* Devices Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
            {filteredDevices.map((device) => {
              const Icon = deviceIcons[device.type] || Lightbulb;
              const room = rooms.find(r => r.id === device.roomId);
              
              if (viewMode === 'grid') {
                return (
                  <Card key={device.id} className="bg-[#141414] border-white/5 hover:border-[#00d4ff]/30 transition-all group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          device.status ? 'bg-[#00d4ff]/20' : 'bg-[#2a2a2a]'
                        }`}>
                          <Icon className={`w-6 h-6 ${device.status ? 'text-[#00d4ff]' : 'text-gray-500'}`} />
                        </div>
                        <Switch
                          checked={device.status}
                          onCheckedChange={() => toggleDevice(device.id)}
                          className="data-[state=checked]:bg-[#00d4ff]"
                        />
                      </div>
                      
                      <h3 className="text-white font-medium mb-1">{device.name}</h3>
                      <p className="text-gray-500 text-sm mb-3">{room?.name}</p>
                      
                      {device.type === 'light' && device.status && (
                        <div className="pt-3 border-t border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-xs">Brightness</span>
                            <span className="text-white text-xs">{device.brightness}%</span>
                          </div>
                          <Slider
                            value={[device.brightness || 50]}
                            onValueChange={(value) => updateDevice(device.id, { brightness: value[0] })}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}
                      
                      {device.temperature !== undefined && (
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-gray-400 text-xs">Temperature</span>
                          <span className="text-[#ffaa00] text-xs">{device.temperature}°F</span>
                        </div>
                      )}
                      
                      {device.power !== undefined && (
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-gray-400 text-xs">Power</span>
                          <span className="text-[#00ff88] text-xs">{device.power}W</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              }
              
              return (
                <div 
                  key={device.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-white/5 hover:border-[#00d4ff]/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      device.status ? 'bg-[#00d4ff]/20' : 'bg-[#2a2a2a]'
                    }`}>
                      <Icon className={`w-5 h-5 ${device.status ? 'text-[#00d4ff]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{device.name}</h3>
                      <p className="text-gray-500 text-sm">{room?.name} • {deviceTypeLabels[device.type]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {device.power !== undefined && (
                      <span className="text-[#00ff88] text-sm">{device.power}W</span>
                    )}
                    <Switch
                      checked={device.status}
                      onCheckedChange={() => toggleDevice(device.id)}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No devices found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
