import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Shield, 
  ShieldCheck,
  Lock,
  Unlock,
  Video,
  Activity,
  Home,
  DoorOpen,
  Bell,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { SecurityData } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function SecurityPage() {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    fetchSecurityData();
    
    const handleSecurityUpdate = (event: CustomEvent<SecurityData>) => {
      setSecurityData(event.detail);
    };

    window.addEventListener('securityUpdated', handleSecurityUpdate as EventListener);
    return () => window.removeEventListener('securityUpdated', handleSecurityUpdate as EventListener);
  }, []);

  const fetchSecurityData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/security`);
      setSecurityData(response.data);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeSystemStatus = async (status: string) => {
    setChangingStatus(true);
    try {
      await axios.post(`${API_URL}/api/security/system/${status}`);
    } catch (error) {
      console.error('Failed to change system status:', error);
    } finally {
      setChangingStatus(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'armed-away':
        return <ShieldCheck className="w-8 h-8 text-[#00ff88]" />;
      case 'armed-home':
        return <Shield className="w-8 h-8 text-[#00d4ff]" />;
      case 'disarmed':
        return <Unlock className="w-8 h-8 text-[#ffaa00]" />;
      default:
        return <Shield className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'armed-away':
        return 'Armed - Away';
      case 'armed-home':
        return 'Armed - Home';
      case 'disarmed':
        return 'Disarmed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'armed-away':
        return 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30';
      case 'armed-home':
        return 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30';
      case 'disarmed':
        return 'bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-[#00ff88]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#ffaa00]" />;
      case 'error':
        return <X className="w-4 h-4 text-[#ff4444]" />;
      default:
        return <Activity className="w-4 h-4 text-[#00d4ff]" />;
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Security</h1>
            <p className="text-gray-400">Monitor and control your home security</p>
          </div>

          {/* System Status */}
          <Card className={`bg-[#141414] border-white/5 mb-6 ${getStatusColor(securityData?.systemStatus || '')}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    securityData?.systemStatus === 'armed-away' ? 'bg-[#00ff88]/20' :
                    securityData?.systemStatus === 'armed-home' ? 'bg-[#00d4ff]/20' :
                    'bg-[#ffaa00]/20'
                  }`}>
                    {getStatusIcon(securityData?.systemStatus || '')}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">System Status</p>
                    <h2 className="text-2xl font-bold">
                      {getStatusText(securityData?.systemStatus || '')}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => changeSystemStatus('armed-home')}
                    disabled={changingStatus || securityData?.systemStatus === 'armed-home'}
                    className={`border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 ${
                      securityData?.systemStatus === 'armed-home' ? 'bg-[#00d4ff]/20' : ''
                    }`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Arm Home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => changeSystemStatus('armed-away')}
                    disabled={changingStatus || securityData?.systemStatus === 'armed-away'}
                    className={`border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 ${
                      securityData?.systemStatus === 'armed-away' ? 'bg-[#00ff88]/20' : ''
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Arm Away
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => changeSystemStatus('disarmed')}
                    disabled={changingStatus || securityData?.systemStatus === 'disarmed'}
                    className={`border-[#ffaa00]/30 text-[#ffaa00] hover:bg-[#ffaa00]/10 ${
                      securityData?.systemStatus === 'disarmed' ? 'bg-[#ffaa00]/20' : ''
                    }`}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Disarm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cameras */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Cameras</CardTitle>
                      <CardDescription className="text-gray-400">
                        Live feeds from your security cameras
                      </CardDescription>
                    </div>
                    <Badge className="bg-[#00ff88]/20 text-[#00ff88]">
                      {securityData?.cameras.filter(c => c.status === 'online').length} Online
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityData?.cameras.map((camera) => (
                      <div 
                        key={camera.id} 
                        className="relative aspect-video bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5"
                      >
                        {/* Camera Feed Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-600" />
                        </div>
                        
                        {/* Camera Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Camera Info */}
                        <div className="absolute top-3 left-3 flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            camera.status === 'online' ? 'bg-[#00ff88] animate-pulse' : 'bg-[#ff4444]'
                          }`} />
                          <span className="text-white text-sm font-medium">{camera.name}</span>
                        </div>

                        {camera.recording && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-[#ff4444]/80 text-white">
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
                              REC
                            </Badge>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-gray-300 text-xs">
                            {new Date().toLocaleTimeString()}
                          </span>
                          <Button size="sm" variant="ghost" className="h-7 text-white hover:bg-white/20">
                            View Full
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Recent Events</CardTitle>
                      <CardDescription className="text-gray-400">
                        Security activity log
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#00d4ff]">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityData?.recentEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="flex items-center space-x-4 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#141414] flex items-center justify-center">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{event.event}</p>
                          <p className="text-gray-500 text-xs">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Status */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#00ff88]" />
                        </div>
                        <span className="text-white">Doors</span>
                      </div>
                      <span className="text-[#00ff88] text-sm">
                        {securityData?.doorsLocked ? 'All Locked' : 'Unlocked'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                          <DoorOpen className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        <span className="text-white">Windows</span>
                      </div>
                      <span className="text-[#00d4ff] text-sm">
                        {securityData?.windowsClosed ? 'All Closed' : 'Open'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ffaa00]/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-[#ffaa00]" />
                        </div>
                        <span className="text-white">Motion</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {securityData?.motionDetected ? 'Detected' : 'No Activity'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Actions */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Emergency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-[#ff4444]/30 text-[#ff4444] hover:bg-[#ff4444]/10"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Trigger Alarm
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 text-white hover:bg-white/5"
                    >
                      Contact Emergency
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Tips */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Security Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#1a1a1a]">
                      <p className="text-white text-sm font-medium mb-1">Arm When Away</p>
                      <p className="text-gray-500 text-xs">Always arm your system when leaving home</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#1a1a1a]">
                      <p className="text-white text-sm font-medium mb-1">Check Cameras</p>
                      <p className="text-gray-500 text-xs">Regularly check camera feeds for issues</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#1a1a1a]">
                      <p className="text-white text-sm font-medium mb-1">Update Codes</p>
                      <p className="text-gray-500 text-xs">Change access codes every 3 months</p>
                    </div>
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
