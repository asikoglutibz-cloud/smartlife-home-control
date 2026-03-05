import { useState } from 'react';
import { 
  User, 
  Home, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  Save,
  Mail,
  Smartphone,
  Globe
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    security: true,
    energy: true,
    devices: false
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-[#141414] border border-white/10 p-1">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="home"
                className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="data-[state=active]:bg-[#00d4ff] data-[state=active]:text-black"
              >
                <Sun className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        defaultValue={user?.name}
                        className="bg-[#1a1a1a] border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        className="bg-[#1a1a1a] border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10 bg-[#1a1a1a] border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={saving}
                      className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141414] border-white/5 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Change Password</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your password for security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-gray-300">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="bg-[#1a1a1a] border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-gray-300">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="bg-[#1a1a1a] border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-300">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="bg-[#1a1a1a] border-white/10 text-white"
                    />
                  </div>
                  <Button className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="home">
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Home Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your home configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="home-name" className="text-gray-300">Home Name</Label>
                    <Input
                      id="home-name"
                      defaultValue={user?.homeName}
                      className="bg-[#1a1a1a] border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="timezone"
                        defaultValue="America/New_York"
                        className="pl-10 bg-[#1a1a1a] border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Preferences</h4>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
                      <div>
                        <p className="text-white text-sm">Temperature Unit</p>
                        <p className="text-gray-500 text-xs">Display temperature in Fahrenheit</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#00d4ff] text-sm">°F</span>
                        <Switch defaultChecked className="data-[state=checked]:bg-[#00d4ff]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a1a]">
                      <div>
                        <p className="text-white text-sm">Energy Unit</p>
                        <p className="text-gray-500 text-xs">Display energy in kWh</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#00d4ff] text-sm">kWh</span>
                        <Switch defaultChecked className="data-[state=checked]:bg-[#00d4ff]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[#00d4ff]" />
                      </div>
                      <div>
                        <p className="text-white">Push Notifications</p>
                        <p className="text-gray-500 text-sm">Receive push notifications on your devices</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#ffaa00]/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#ffaa00]" />
                      </div>
                      <div>
                        <p className="text-white">Email Notifications</p>
                        <p className="text-gray-500 text-sm">Receive email updates and reports</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>

                  <Separator className="bg-white/10" />

                  <h4 className="text-white font-medium">Alert Types</h4>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#00ff88]" />
                      </div>
                      <div>
                        <p className="text-white">Security Alerts</p>
                        <p className="text-gray-500 text-sm">Motion detection, door openings, etc.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.security}
                      onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#ff00ff]/20 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-[#ff00ff]" />
                      </div>
                      <div>
                        <p className="text-white">Energy Reports</p>
                        <p className="text-gray-500 text-sm">Weekly energy usage summaries</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.energy}
                      onCheckedChange={(checked) => setNotifications({...notifications, energy: checked})}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                        <Home className="w-5 h-5 text-[#00d4ff]" />
                      </div>
                      <div>
                        <p className="text-white">Device Updates</p>
                        <p className="text-gray-500 text-sm">Firmware updates and device status</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.devices}
                      onCheckedChange={(checked) => setNotifications({...notifications, devices: checked})}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="bg-[#141414] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Appearance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize how the app looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                        {theme === 'dark' ? (
                          <Moon className="w-5 h-5 text-[#00d4ff]" />
                        ) : (
                          <Sun className="w-5 h-5 text-[#00d4ff]" />
                        )}
                      </div>
                      <div>
                        <p className="text-white">Dark Mode</p>
                        <p className="text-gray-500 text-sm">Toggle between light and dark theme</p>
                      </div>
                    </div>
                    <Switch 
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-[#00d4ff]"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Accent Color</h4>
                    <div className="flex space-x-3">
                      {['#00d4ff', '#00ff88', '#ffaa00', '#ff00ff', '#ff4444'].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg border-2 border-white/10 hover:border-white/50 transition-colors"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Preview</h4>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-100'}`}>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#00d4ff' }}
                        >
                          <Home className="w-4 h-4 text-black" />
                        </div>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          Sample Card
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
