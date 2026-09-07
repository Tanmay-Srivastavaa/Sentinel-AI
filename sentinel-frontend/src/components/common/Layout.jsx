import React, { useState } from 'react';
import { 
  LayoutDashboard, Mail, Search, Globe, Server, 
  FileText, Settings, Shield, Command, Sun, Moon, Bell, Play, Menu
} from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab, isDarkMode, setIsDarkMode, onRunDemo }) => {
  // NEW: State to control the sidebar width
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'analysis', icon: Mail, label: 'Email Analysis' },
    { id: 'investigations', icon: Search, label: 'Investigations' },
    { id: 'intel', icon: Globe, label: 'Threat Intelligence' },
    { id: 'infra', icon: Server, label: 'Infrastructure' },
    { id: 'reports', icon: FileText, label: 'Forensic Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0B0F17] font-sans text-gray-900 dark:text-white">
      
      {/* SIDEBAR - Dynamic width based on isCollapsed state */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F17] flex flex-col justify-between print:hidden shrink-0 z-20`}
      >
        <div>
          {/* Logo Section */}
          <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-200 dark:border-gray-800 transition-all duration-300`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            
            {/* Hide text when collapsed */}
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
                <h1 className="font-bold text-sm tracking-wide text-gray-900 dark:text-white">SENTINEL AI</h1>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Threat Detection</p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : ''} // Shows tooltip when hovered in collapsed mode
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'} py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                  
                  {!isCollapsed && (
                    <span className="whitespace-nowrap animate-in fade-in duration-300">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Status (Bottom of Sidebar) */}
        <div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'} py-2`}>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200">System Status</p>
                <p className="text-[10px] text-gray-500">All systems operational</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:overflow-visible print:h-auto">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0F17] flex items-center justify-between px-6 print:hidden shrink-0 z-10 transition-colors">
          
          <div className="flex items-center flex-1 max-w-xl gap-4">
            {/* NEW: Sidebar Toggle Button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="relative w-full flex items-center hidden sm:flex">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search cases, IPs, domains, indicators..." 
                className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs rounded-lg pl-9 pr-12 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <div className="absolute right-2 flex items-center gap-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded px-1.5 py-0.5">
                <Command className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400">K</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={onRunDemo}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              <Play className="w-3 h-3 fill-current" /> Demo Mode
            </button>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-50 dark:border-[#0B0F17]"></span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer pl-1">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                TS
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">T. Srivastava</p>
                <p className="text-[10px] text-gray-500">Team Lead Analyst</p>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-[#0B0F17] print:p-0 print:bg-white print:overflow-visible">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;