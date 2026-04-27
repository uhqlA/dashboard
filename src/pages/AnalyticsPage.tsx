import React from 'react';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { Download, Filter, BarChart3, PieChart, LineChart, FileText, Edit3, Share2, Bell } from 'lucide-react';

const AnalyticsPage = () => {
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const pieData = [
    { name: 'Wetlands', value: 400, color: '#3b82f6' },
    { name: 'Forest', value: 300, color: '#10b981' },
    { name: 'Urban', value: 200, color: '#6b7280' },
    { name: 'Water', value: 100, color: '#3b82f6' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and analyze wetlands data in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Wetlands Coverage</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">1,234</p>
              <p className="text-gray-500 dark:text-gray-400">hectares</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Land Use Distribution</h3>
            <PieChart className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Trend Analysis</h3>
            <LineChart className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">+12.5%</p>
              <p className="text-gray-500 dark:text-gray-400">Growth this quarter</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Overview</h3>
          <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-80 bg-slate-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Chart visualization will appear here</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Showing data for the selected period</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  item % 2 === 0 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <span className="text-sm font-medium">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item % 2 === 0 ? 'Water Level Alert' : 'Temperature Warning'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item % 2 === 0 
                      ? 'Water levels have risen above threshold in Zone B'
                      : 'Unusual temperature spike detected in the northern sector'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {item} hour{item !== 1 ? 's' : ''} ago • {item % 2 === 0 ? 'High Priority' : 'Medium Priority'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Generate Report', icon: <FileText className="w-5 h-5" /> },
              { label: 'Add Annotation', icon: <Edit3 className="w-5 h-5" /> },
              { label: 'Share Dashboard', icon: <Share2 className="w-5 h-5" /> },
              { label: 'Set Alert', icon: <Bell className="w-5 h-5" /> },
            ].map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="flex flex-col h-20 items-center justify-center space-y-2 text-center"
              >
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
