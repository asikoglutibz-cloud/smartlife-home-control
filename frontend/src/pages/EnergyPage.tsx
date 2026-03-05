import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Clock,
  DollarSign,
  Lightbulb,
  Thermometer,
  Tv,
  Coffee
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { EnergyData } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const categoryIcons: Record<string, React.ElementType> = {
  HVAC: Thermometer,
  'Water Heater': Zap,
  Lighting: Lightbulb,
  Electronics: Tv,
  Other: Coffee
};

export default function EnergyPage() {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUsage, setCurrentUsage] = useState(2.4);

  useEffect(() => {
    fetchEnergyData();
    
    const handleEnergyUpdate = (event: CustomEvent<{ currentUsage: number }>) => {
      setCurrentUsage(event.detail.currentUsage);
    };

    window.addEventListener('energyUpdate', handleEnergyUpdate as EventListener);
    return () => window.removeEventListener('energyUpdate', handleEnergyUpdate as EventListener);
  }, []);

  const fetchEnergyData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/energy`);
      setEnergyData(response.data);
      setCurrentUsage(response.data.currentUsage);
    } catch (error) {
      console.error('Failed to fetch energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff]" />
      </div>
    );
  }

  const chartData = energyData?.hourlyData.map(d => ({
    hour: d.hour,
    usage: d.usage
  })) || [];

  const pieData = energyData?.breakdown.map(b => ({
    name: b.category,
    value: b.percentage,
    color: b.color
  })) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Energy Insights</h1>
            <p className="text-gray-400">Monitor and optimize your home's energy consumption</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#141414] border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Usage</p>
                    <p className="text-2xl font-bold text-white">{currentUsage.toFixed(1)} kW</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#00d4ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today's Total</p>
                    <p className="text-2xl font-bold text-white">{energyData?.todayTotal} kWh</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#00ff88]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Monthly Estimate</p>
                    <p className="text-2xl font-bold text-white">${energyData?.monthlyEstimate}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#ffaa00]/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#ffaa00]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Savings</p>
                    <p className="text-2xl font-bold text-[#00ff88]">{energyData?.savings}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-[#00ff88]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Hourly Usage</CardTitle>
                      <CardDescription className="text-gray-400">
                        Energy consumption throughout the day
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-[#00d4ff]/10 text-[#00d4ff]">
                      Peak: {energyData?.peakHours}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis 
                          dataKey="hour" 
                          stroke="#666" 
                          tick={{ fill: '#666', fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="#666" 
                          tick={{ fill: '#666', fontSize: 12 }}
                          label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#666' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#fff' }}
                          itemStyle={{ color: '#00d4ff' }}
                        />
                        <Bar dataKey="usage" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Energy Breakdown */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Usage by Category</CardTitle>
                  <CardDescription className="text-gray-400">
                    Breakdown of energy consumption by device type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {energyData?.breakdown.map((item) => {
                      const Icon = categoryIcons[item.category] || Zap;
                      return (
                        <div key={item.category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${item.color}20` }}
                              >
                                <Icon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <span className="text-white">{item.category}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-400 text-sm">{item.wattage}W</span>
                              <span className="text-white font-medium">{item.percentage}%</span>
                            </div>
                          </div>
                          <Progress 
                            value={item.percentage} 
                            className="h-2 bg-[#2a2a2a]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pie Chart */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a1a', 
                            border: '1px solid #333',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-400 text-xs">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30">
                      <div className="flex items-start space-x-3">
                        <TrendingDown className="w-5 h-5 text-[#00ff88] mt-0.5" />
                        <div>
                          <p className="text-white text-sm font-medium">Saving Energy</p>
                          <p className="text-gray-400 text-xs">
                            You're using {energyData?.savings}% less energy than last week
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#ffaa00]/10 border border-[#ffaa00]/30">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-[#ffaa00] mt-0.5" />
                        <div>
                          <p className="text-white text-sm font-medium">Peak Hours</p>
                          <p className="text-gray-400 text-xs">
                            Your peak usage is between {energyData?.peakHours}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                      <div className="flex items-start space-x-3">
                        <Thermometer className="w-5 h-5 text-[#00d4ff] mt-0.5" />
                        <div>
                          <p className="text-white text-sm font-medium">HVAC Usage</p>
                          <p className="text-gray-400 text-xs">
                            HVAC accounts for {energyData?.breakdown[0]?.percentage}% of your energy use
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Average */}
              <Card className="bg-[#141414] border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Daily Average</p>
                      <p className="text-xl font-bold text-white">{energyData?.dailyAverage} kWh</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00d4ff]" />
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
