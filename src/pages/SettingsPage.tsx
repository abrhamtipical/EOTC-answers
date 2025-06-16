
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Moon, Bell, Shield, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Sign in to access settings
          </h3>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-amber-800 dark:text-amber-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your EOTC Answers experience
        </p>
      </div>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
            <User className="h-5 w-5" />
            <span>Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-600 dark:text-gray-300">Email</Label>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
            <Moon className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-gray-800 dark:text-gray-200">
                Dark Mode
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use dark theme for better reading at night
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Daily Devotions
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Receive daily spiritual content
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                New Content
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get notified about new teachings and FAQ
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-amber-200 dark:border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800 dark:text-amber-100">
            <Shield className="h-5 w-5" />
            <span>Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Reading Analytics
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track reading progress and preferences
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-800 dark:text-gray-200">
                Share Usage Data
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Help improve the app by sharing anonymous usage data
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
