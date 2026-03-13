import { Bell, User } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-16 bg-[#f8f9fa] border-b border-gray-300 flex items-center justify-between px-8 shadow-sm">
      <h1 className="text-xl font-bold text-slate-800">Dashboard Title</h1>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center text-slate-600 cursor-pointer hover:text-blue-600">
          <Bell size={20} className="mr-2" />
          <span className="text-sm font-semibold italic">Notifications</span>
        </div>
        
        <div className="flex items-center text-slate-600 cursor-pointer hover:text-blue-600">
          <User size={20} className="mr-2" />
          <span className="text-sm font-semibold italic">User Profile</span>
        </div>
        
        <button className="bg-[#7f8c8d] text-white px-5 py-1.5 rounded text-sm font-bold hover:bg-slate-600 transition-all shadow-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;