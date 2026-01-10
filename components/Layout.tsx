import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MOCK_USER } from "../constants";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { name: "Overview", path: "/", icon: "dashboard" },
    { name: "Contracts", path: "/contracts", icon: "description" },
    { name: "Time Tracking", path: "/time-tracking", icon: "schedule" },
    { name: "Reports", path: "/reports", icon: "analytics" },
    { name: "Audit Logs", path: "/audit-logs", icon: "fact_check" },
    { name: "Settings", path: "/settings", icon: "settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark flex flex-col justify-between z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Vendor Admin</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enterprise SaaS</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark hover:text-primary"
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive ? "filled-icon" : ""}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-border-dark">
          <div className="flex items-center gap-3">
             <img 
               src={MOCK_USER.avatar} 
               alt="User" 
               className="size-9 rounded-full bg-slate-200 border-2 border-slate-100 dark:border-slate-700" 
             />
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate">{MOCK_USER.name}</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{MOCK_USER.role}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
           {/* Search */}
           <div className="flex items-center gap-4 w-96">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text" 
                placeholder="Search contracts, logs..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-surface-dark border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white transition-all outline-none"
              />
            </div>
           </div>

           {/* Actions */}
           <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark rounded-full transition-colors"
                title="Toggle Theme"
              >
                <span className="material-symbols-outlined">
                  {isDarkMode ? "light_mode" : "dark_mode"}
                </span>
              </button>
              <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2.5 size-2 bg-red-500 border-2 border-white dark:border-background-dark rounded-full"></span>
              </button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth relative">
          {children}
        </div>
      </main>
    </div>
  );
};
