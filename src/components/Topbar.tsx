import { useState, useRef, useEffect } from 'react';
import { Bell, User, ChevronDown, Settings, LogOut, AlertTriangle, AlertCircle, Info, MapPin, Droplet, Sun, CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  type: 'alert' | 'warning' | 'info' | 'success';
  message: string;
  time: string;
  read: boolean;
  location?: string;
  metric?: string;
  value?: string;
}

const Topbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      type: 'alert', 
      message: 'Water level critical', 
      time: '15 min ago', 
      read: false, 
      location: 'Lake Victoria, Western Kenya',
      metric: 'Water Level',
      value: '1.2m (below threshold)'
    },
    { 
      id: 2, 
      type: 'warning', 
      message: 'Unusual temperature rise detected', 
      time: '2 hours ago', 
      read: false,
      location: 'Samburu National Reserve',
      metric: 'Temperature',
      value: '38°C (+5.1° from avg)'
    },
    { 
      id: 3, 
      type: 'info', 
      message: 'Scheduled maintenance: System maintenance scheduled for tonight at 2 AM', 
      time: '1 day ago', 
      read: true
    },
    { 
      id: 4, 
      type: 'success', 
      message: 'Data sync completed: All sensor data has been successfully synchronized', 
      time: '3 hours ago', 
      read: true
    },
  ]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const user = {
    name: 'National Admin',
    email: 'admin@kenya-env.go.ke',
    role: 'National Administrator',
    lastLogin: 'Today, 08:45 AM',
    avatar: 'https://ui-avatars.com/api/?name=Marsabit+Admin&background=0ea5e9&color=fff'
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-green-600 to-black flex items-center justify-center text-white text-sm font-bold mr-2">
            KE
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Kenya Environmental Dashboard</h1>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Droplet size={14} className="mr-1 text-blue-500" />
            <span>National Water Monitoring</span>
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Sun size={14} className="mr-1 text-yellow-500" />
            <span>Climate Data</span>
          </span>
          <span>•</span>
          <span className="flex items-center">
            <MapPin size={14} className="mr-1 text-green-500" />
            <span>National GIS</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">Environmental Alerts</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <Settings size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-gray-700/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 mt-0.5 mr-3 ${
                          notification.type === 'success' ? 'text-green-500' : 
                          notification.type === 'warning' ? 'text-yellow-500' : 
                          notification.type === 'alert' ? 'text-red-500' : 'text-blue-500'
                        }`}>
                          {notification.type === 'success' ? (
                            <CheckCircle size={18} />
                          ) : notification.type === 'warning' ? (
                            <AlertTriangle size={18} />
                          ) : notification.type === 'alert' ? (
                            <AlertCircle size={18} />
                          ) : (
                            <Info size={18} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          
                          {notification.location && (
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <MapPin size={12} className="mr-1" />
                              {notification.location}
                            </div>
                          )}
                          
                          {notification.metric && notification.value && (
                            <div className="mt-1 flex items-center text-xs">
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                {notification.metric}: <span className="font-medium">{notification.value}</span>
                              </span>
                            </div>
                          )}
                          
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No new alerts
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline">
              {user.name}
            </span>
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 hidden md:inline" />
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        {user.role}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Last login: {user.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
                >
                  <User size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div>View Profile</div>
                    <div className="text-xs text-gray-400">Personal information</div>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
                >
                  <Settings size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div>Dashboard Settings</div>
                    <div className="text-xs text-gray-400">Customize your view</div>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
                >
                  <MapPin size={16} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div>Manage Locations</div>
                    <div className="text-xs text-gray-400">Monitoring sites</div>
                  </div>
                </a>
              </div>
              <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut size={16} className="mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;