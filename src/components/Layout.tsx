import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'analytics' | 'maps' | 'settings';
  setCurrentPage: (page: 'home' | 'analytics' | 'maps' | 'settings') => void;
}

const Layout = ({ children, currentPage, setCurrentPage }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;