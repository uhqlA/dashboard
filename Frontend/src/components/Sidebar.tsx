import { Home, BarChart2, MapPin, Settings, Menu } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const menuItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Analytics', icon: BarChart2, active: false },
    { name: 'Maps', icon: MapPin, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} bg-[#2c3e50] text-gray-300 flex flex-col h-screen`}>
      {/* Top Section with Hamburger */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <button onClick={toggleSidebar} className="hover:text-white">
          <Menu size={24} />
        </button>
        {!isCollapsed && <span className="ml-4 font-bold text-white text-lg">Dashboard</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center px-6 py-4 cursor-pointer transition-colors ${
              item.active ? 'bg-[#3498db] text-white border-l-4 border-white' : 'hover:bg-[#34495e]'
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