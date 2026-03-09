import React from 'react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { LayoutDashboard, Map, Settings, BarChart3 } from 'lucide-react';

const HomePage = () => {
  const quickActions = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/analytics' },
    { icon: <Map className="w-5 h-5" />, label: 'View Map', path: '/maps' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Reports', path: '/reports' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your wetlands monitoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                {action.icon}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">{action.label}</h3>
              <Button variant="outline" className="w-full">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start space-x-3">
                <div className="shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">{item}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Activity {item}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description of activity {item}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Wetlands', value: '1,234' },
              { label: 'Active Alerts', value: '12' },
              { label: 'Surveys This Month', value: '45' },
              { label: 'Team Members', value: '8' },
            ].map((stat, index) => (
              <div key={index} className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
