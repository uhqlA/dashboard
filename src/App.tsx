import { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Map from './components/Map';
import Analytics from './components/Analytics';
import Metadata from './components/Metadata';

function App() {
  const [viewMode, setViewMode] = useState<'split' | 'map-full' | 'analytics-full'>('split');
  const [metadataHeight, setMetadataHeight] = useState(128);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'analytics' | 'maps' | 'settings'>('home');
  const [selectedCounty, setSelectedCounty] = useState({
    name: 'Marsabit County',
    wetlandsArea: '1200 sq km',
    lastUpdated: 'February 18, 2026',
    dataSource: 'Environmental Monitoring System'
  });

  // Settings state
  const [settings, setSettings] = useState({
    defaultMapLayer: 'OpenStreetMap',
    autoFlyToCounty: true,
    showCountyLabels: false,
    theme: 'light',
    defaultViewMode: 'split' as 'split' | 'map-full' | 'analytics-full',
    dataRefreshInterval: 30, // minutes
    alertThreshold: 10, // percentage change
    enableNotifications: false,
    units: 'metric'
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const applyTheme = (theme: string) => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
    } else if (theme === 'auto') {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  };

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newHeight = window.innerHeight - e.clientY - 100;
    setMetadataHeight(Math.max(64, Math.min(300, newHeight)));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Attach mouse event listeners when resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({...prev, ...parsedSettings}));
        // Apply loaded settings
        if (parsedSettings.defaultViewMode) {
          setViewMode(parsedSettings.defaultViewMode);
        }
        // Apply theme
        applyTheme(parsedSettings.theme || 'light');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleCountySelect = (county: any) => {
    setSelectedCounty({
      name: county.name,
      wetlandsArea: county.wetlandsArea,
      lastUpdated: county.lastUpdated,
      dataSource: county.dataSource
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="h-full flex flex-col">
            {/* Control Buttons */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 rounded ${viewMode === 'split' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Split View
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="h-full flex">
                {/* Interactive Map */}
                <div className="flex-1 h-full">
                  <Map onCountySelect={handleCountySelect} selectedCountyName={selectedCounty.name} settings={settings} />
                </div>

                {/* Analytics and Metadata */}
                <div className="flex-1 h-full flex flex-col">
                  <div className="flex-1">
                    <Analytics />
                  </div>
                  
                  {/* Resize Handle */}
                  <div
                    className="h-1 bg-gray-300 dark:bg-gray-600 cursor-row-resize hover:bg-gray-400 dark:hover:bg-gray-500 active:bg-blue-500 transition-colors"
                    onMouseDown={handleMouseDown}
                  ></div>
                  
                  <div className="p-4" style={{ height: metadataHeight }}>
                    <Metadata 
                      region={selectedCounty.name}
                      wetlandsArea={selectedCounty.wetlandsArea}
                      lastUpdated={selectedCounty.lastUpdated}
                      dataSource={selectedCounty.dataSource}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="h-full">
            {/* Control Buttons */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => setViewMode('analytics-full')}
                className={`px-4 py-2 rounded ${viewMode === 'analytics-full' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Full Screen Analytics
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Analytics />
            </div>
          </div>
        );
      
      case 'maps':
        return (
          <div className="h-full flex flex-col">
            {/* Control Buttons */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => setViewMode('map-full')}
                className={`px-4 py-2 rounded ${viewMode === 'map-full' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Full Screen Map
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Map onCountySelect={handleCountySelect} selectedCountyName={selectedCounty.name} settings={settings} />
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Settings</h2>
              
              {/* Map Settings */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Map Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Map Layer
                    </label>
                    <select
                      value={settings.defaultMapLayer}
                      onChange={(e) => setSettings({...settings, defaultMapLayer: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="OpenStreetMap">OpenStreetMap</option>
                      <option value="Satellite">Satellite</option>
                      <option value="Terrain">Terrain</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoFly"
                      checked={settings.autoFlyToCounty}
                      onChange={(e) => setSettings({...settings, autoFlyToCounty: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="autoFly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Auto-fly to selected county
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="countyLabels"
                      checked={settings.showCountyLabels}
                      onChange={(e) => setSettings({...settings, showCountyLabels: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="countyLabels" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Show county labels on map
                    </label>
                  </div>
                </div>
              </div>

              {/* UI Settings */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">User Interface</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default View Mode
                    </label>
                    <select
                      value={settings.defaultViewMode}
                      onChange={(e) => setSettings({...settings, defaultViewMode: e.target.value as 'split' | 'map-full' | 'analytics-full'})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="split">Split View</option>
                      <option value="map-full">Full Screen Map</option>
                      <option value="analytics-full">Full Screen Analytics</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({...settings, theme: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Units
                    </label>
                    <select
                      value={settings.units}
                      onChange={(e) => setSettings({...settings, units: e.target.value})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="metric">Metric (sq km)</option>
                      <option value="imperial">Imperial (sq miles)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Settings */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Data & Monitoring</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data Refresh Interval (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.dataRefreshInterval}
                      onChange={(e) => setSettings({...settings, dataRefreshInterval: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alert Threshold (% change in wetlands area)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.alertThreshold}
                      onChange={(e) => setSettings({...settings, alertThreshold: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={settings.enableNotifications}
                      onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable email notifications for alerts
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      // Reset to defaults
                      setSettings({
                        defaultMapLayer: 'OpenStreetMap',
                        autoFlyToCounty: true,
                        showCountyLabels: false,
                        theme: 'light',
                        defaultViewMode: 'split',
                        dataRefreshInterval: 30,
                        alertThreshold: 10,
                        enableNotifications: false,
                        units: 'metric'
                      });
                    }}
                    className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={() => {
                      // Save settings to localStorage
                      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
                      // Apply theme immediately
                      applyTheme(settings.theme);
                      alert('Settings saved successfully!');
                    }}
                    className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;