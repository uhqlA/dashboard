import { Home, BarChart2, MapPin, Settings, Menu } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: 'home' | 'analytics' | 'maps' | 'settings';
  setCurrentPage: (page: 'home' | 'analytics' | 'maps' | 'settings') => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar, currentPage, setCurrentPage }: SidebarProps) => {
  const menuItems = [
    { name: 'Home', icon: Home, key: 'home' as const },
    { name: 'Analytics', icon: BarChart2, key: 'analytics' as const },
    { name: 'Maps', icon: MapPin, key: 'maps' as const },
    { name: 'Settings', icon: Settings, key: 'settings' as const },
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} bg-linear-to-b from-pink-300 to-pink-400 dark:from-slate-900 dark:to-slate-800 text-gray-800 dark:text-gray-100 flex flex-col h-screen border-r border-pink-500 dark:border-slate-700`}>
      {/* Top Section with Hamburger */}
      <div className="h-16 flex items-center px-6 border-b border-pink-500 dark:border-slate-700">
        <button onClick={toggleSidebar} className="hover:text-purple-700 dark:hover:text-blue-400 transition-colors">
          <Menu size={24} />
        </button>
        {!isCollapsed && <span className="ml-4 font-bold text-purple-800 dark:text-white text-lg">Dashboard</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setCurrentPage(item.key)}
            className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200 ${
              currentPage === item.key 
                ? 'bg-purple-600 text-white border-l-4 border-purple-800 dark:bg-blue-600 dark:border-blue-400' 
                : 'hover:bg-pink-500 hover:text-purple-900 dark:hover:bg-slate-800 dark:hover:text-blue-300'
            }`}
          >
            <item.icon size={22} className={isCollapsed ? 'mx-auto' : 'mr-4'} />
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;