import React from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: 'home' | 'analytics' | 'maps' | 'settings';
  setCurrentPage: (page: 'home' | 'analytics' | 'maps' | 'settings') => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar, currentPage, setCurrentPage }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'maps', label: 'Maps', icon: '🗺️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Dashboard
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentPage(item.id as any)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">admin@dashboard.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
