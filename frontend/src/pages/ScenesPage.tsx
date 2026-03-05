import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Sun, 
  Moon, 
  Film, 
  Music, 
  DoorOpen, 
  Play,
  Pause,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import type { Scene } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const sceneIcons: Record<string, React.ElementType> = {
  sun: Sun,
  moon: Moon,
  film: Film,
  music: Music,
  'door-open': DoorOpen
};

const sceneColors: Record<string, { bg: string; icon: string; border: string }> = {
  sun: { bg: 'from-[#ffaa00]/20 to-[#ff8800]/10', icon: 'text-[#ffaa00]', border: 'border-[#ffaa00]/30' },
  moon: { bg: 'from-[#00d4ff]/20 to-[#0099cc]/10', icon: 'text-[#00d4ff]', border: 'border-[#00d4ff]/30' },
  film: { bg: 'from-[#ff00ff]/20 to-[#cc00cc]/10', icon: 'text-[#ff00ff]', border: 'border-[#ff00ff]/30' },
  music: { bg: 'from-[#00ff88]/20 to-[#00cc66]/10', icon: 'text-[#00ff88]', border: 'border-[#00ff88]/30' },
  'door-open': { bg: 'from-[#ff4444]/20 to-[#cc3333]/10', icon: 'text-[#ff4444]', border: 'border-[#ff4444]/30' }
};

export default function ScenesPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatingScene, setActivatingScene] = useState<number | null>(null);

  useEffect(() => {
    fetchScenes();
    
    const handleSceneActivated = (event: CustomEvent<Scene>) => {
      setScenes(prev => prev.map(s => ({ ...s, active: s.id === event.detail.id })));
    };

    window.addEventListener('sceneActivated', handleSceneActivated as EventListener);
    return () => window.removeEventListener('sceneActivated', handleSceneActivated as EventListener);
  }, []);

  const fetchScenes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/scenes`);
      setScenes(response.data);
    } catch (error) {
      console.error('Failed to fetch scenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateScene = async (sceneId: number) => {
    setActivatingScene(sceneId);
    try {
      await axios.post(`${API_URL}/api/scenes/${sceneId}/activate`);
    } catch (error) {
      console.error('Failed to activate scene:', error);
    } finally {
      setTimeout(() => setActivatingScene(null), 1000);
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Scenes</h1>
              <p className="text-gray-400">Automate your home with one-touch scenes</p>
            </div>
            <Button className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Create Scene
            </Button>
          </div>

          {/* Active Scene Banner */}
          {scenes.find(s => s.active) && (
            <Card className="bg-gradient-to-r from-[#00d4ff]/20 to-[#00d4ff]/5 border-[#00d4ff]/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Currently Active</p>
                      <h3 className="text-white text-xl font-semibold">
                        {scenes.find(s => s.active)?.name}
                      </h3>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10">
                    <Pause className="w-4 h-4 mr-2" />
                    Deactivate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scenes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map((scene) => {
              const Icon = sceneIcons[scene.icon] || Sun;
              const colors = sceneColors[scene.icon] || sceneColors.sun;
              const isActivating = activatingScene === scene.id;
              
              return (
                <Card 
                  key={scene.id} 
                  className={`bg-[#141414] border-white/5 hover:border-[#00d4ff]/30 transition-all group overflow-hidden ${
                    scene.active ? 'ring-2 ring-[#00d4ff]/50' : ''
                  }`}
                >
                  <div className={`h-24 bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`w-12 h-12 ${colors.icon} opacity-50`} />
                    </div>
                    {scene.active && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#00d4ff] text-black">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{scene.name}</h3>
                        <p className="text-gray-500 text-sm">{scene.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{scene.actions.length} actions</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={() => activateScene(scene.id)}
                      disabled={isActivating}
                      className={`w-full mt-4 ${
                        scene.active 
                          ? 'bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30' 
                          : 'bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black'
                      }`}
                    >
                      {isActivating ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Activating...
                        </>
                      ) : scene.active ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Active
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Tips */}
          <Card className="bg-[#141414] border-white/5 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">Scene Tips</CardTitle>
              <CardDescription className="text-gray-400">
                Get the most out of your smart home scenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#1a1a1a]">
                  <Sun className="w-8 h-8 text-[#ffaa00] mb-3" />
                  <h4 className="text-white font-medium mb-1">Morning Routine</h4>
                  <p className="text-gray-500 text-sm">Gradually turn on lights and start your coffee maker</p>
                </div>
                <div className="p-4 rounded-lg bg-[#1a1a1a]">
                  <Film className="w-8 h-8 text-[#ff00ff] mb-3" />
                  <h4 className="text-white font-medium mb-1">Movie Night</h4>
                  <p className="text-gray-500 text-sm">Dim lights and turn on your entertainment system</p>
                </div>
                <div className="p-4 rounded-lg bg-[#1a1a1a]">
                  <DoorOpen className="w-8 h-8 text-[#ff4444] mb-3" />
                  <h4 className="text-white font-medium mb-1">Leaving Home</h4>
                  <p className="text-gray-500 text-sm">Turn off all devices and arm your security system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
