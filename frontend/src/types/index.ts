export interface User {
  id: number;
  email: string;
  name: string;
  homeName: string;
}

export interface Room {
  id: number;
  name: string;
  icon: string;
  deviceCount: number;
  temperature: number;
  humidity: number;
  devices?: Device[];
}

export interface Device {
  id: number;
  name: string;
  type: 'light' | 'climate' | 'entertainment' | 'appliance' | 'security' | 'fan' | 'curtain' | 'door' | 'sensor';
  roomId: number;
  status: boolean;
  brightness?: number;
  color?: string;
  temperature?: number;
  volume?: number;
  mode?: string;
  position?: number;
  speed?: number;
  recording?: boolean;
  power?: number;
}

export interface Scene {
  id: number;
  name: string;
  icon: string;
  description: string;
  active: boolean;
  actions: SceneAction[];
}

export interface SceneAction {
  deviceId: number | string;
  status?: boolean;
  brightness?: number;
  color?: string;
  temperature?: number;
  mode?: string;
  position?: number;
  recording?: boolean;
}

export interface EnergyBreakdown {
  category: string;
  percentage: number;
  wattage: number;
  color: string;
}

export interface HourlyData {
  hour: string;
  usage: number;
}

export interface EnergyData {
  currentUsage: number;
  todayTotal: number;
  monthlyEstimate: number;
  dailyAverage: number;
  savings: number;
  peakHours: string;
  breakdown: EnergyBreakdown[];
  hourlyData: HourlyData[];
}

export interface Camera {
  id: number;
  name: string;
  status: string;
  recording: boolean;
}

export interface SecurityEvent {
  id: number;
  time: string;
  event: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface SecurityData {
  systemStatus: 'armed-home' | 'armed-away' | 'disarmed';
  doorsLocked: boolean;
  windowsClosed: boolean;
  motionDetected: boolean;
  cameras: Camera[];
  recentEvents: SecurityEvent[];
}

export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  activeScenes: number;
  totalPower: number;
  temperature: number;
  humidity: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: SecurityEvent[];
  activeAlerts: string[];
}
