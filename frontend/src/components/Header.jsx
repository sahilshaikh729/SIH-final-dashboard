import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  UserCheck,
  LayoutDashboard,
  History,
  Bell,
  ChevronDown,
  Sparkles,
  Gauge,
  Sun,
  Moon
} from 'lucide-react';
import { Dock, DockItem, DockIcon, DockLabel } from './core/dock';

export default function Header({ 
  activeTab,
  setActiveTab,
  personCount = 0,
  events = [],
  stats = {},
  isConnected = false, 
  soundEnabled = true, 
  setSoundEnabled, 
  onTriggerMock, 
  isOnline = true,
  dronePosition = null,
  onOpenLanding = null,
  theme = 'dark',
  toggleTheme
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const hasActiveAlerts = personCount > 0 || (stats && stats.active_high_priority > 0);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'detections', label: 'Detection', icon: UserCheck, badge: personCount },
    { id: 'history', label: 'Missions', icon: History },
    { id: 'monitor', label: 'Monitor', icon: Gauge },
  ];

  return (
    <header className="w-full max-w-[1880px] mx-auto px-4 lg:px-6 mt-3.5 mb-1.5 h-[88px] select-none font-sans shrink-0 min-w-0 animate-[glass-header-slide_0.5s_ease-out]">
      {/* Target Large Floating Glass Panel Container */}
      <div 
        className="w-full h-full px-5 lg:px-7 py-2.5 flex items-center justify-between gap-4 lg:gap-6 min-w-0 glass-header-bar"
      >
        
        {/* LEFT SECTION: BRANDING */}
        <div className="flex items-center gap-3.5 shrink-0 min-w-0">
          
          {/* Signal / Radio Icon Badge + Brand Text */}
          <div 
            onClick={() => onOpenLanding && onOpenLanding()} 
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
            title="Click to view Hero Landing View"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(59,130,246,0.3)] group-hover:border-blue-400/70 group-hover:bg-blue-500/30 transition-all p-1 overflow-hidden">
              <img 
                src="/rayo_lab_logo.png" 
                alt="RAYO LAB Logo" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-bold tracking-wider text-[#f2f5f8] uppercase font-sans group-hover:text-blue-300 transition-colors leading-tight truncate">
                SALVADOR
              </h1>
              <p className="text-[9.5px] lg:text-[10.5px] font-semibold tracking-[0.2em] text-[#22d3ee] uppercase font-sans mt-0.5 truncate">
                RESCUE MONITORING
              </p>
            </div>
          </div>

          {/* Vertical Glass Divider */}
          <div className="h-8 w-px bg-white/15 hidden xl:block shrink-0" />
        </div>

        {/* CENTER SECTION: ELEGANT SANS-SERIF NAVIGATION */}
        <nav className="hidden md:flex items-center justify-center w-[50%] lg:w-[54%] xl:w-[56%] min-w-[540px] xl:min-w-[620px] max-w-none mx-auto shrink-0">
          <Dock className="w-full justify-center bg-[#111927]/90 backdrop-blur-md border border-white/8 shadow-xl rounded-2xl px-4 lg:px-6 py-2 h-[62px] min-h-[58px] max-h-[68px] gap-4 lg:gap-7 xl:gap-9 overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <DockItem
                  key={item.id}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                  isActive={isActive}
                  className="px-4 lg:px-5 xl:px-6 py-2 flex items-center gap-2.5 lg:gap-3 shrink-0 whitespace-nowrap overflow-visible"
                >
                  <DockIcon isActive={isActive}>
                    <Icon className={`w-[19px] h-[19px] lg:w-5 lg:h-5 transition-transform duration-200 ${isActive ? 'text-[#22d3ee] scale-110' : 'text-slate-400'}`} />
                  </DockIcon>
                  <span className={`whitespace-nowrap overflow-visible font-sans text-sm lg:text-base font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)] shrink-0">
                      {item.badge}
                    </span>
                  )}
                  <DockLabel>{item.label}</DockLabel>
                </DockItem>
              );
            })}
          </Dock>
        </nav>

        {/* RIGHT SECTION: ACTIONS, STATUS & CONTROLS */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0 min-w-0">

          {/* Quick Action Glass Buttons: [ TEST EVENT ] */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onTriggerMock && onTriggerMock('WIFI')}
              className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white font-display font-semibold text-xs border border-blue-400/50 transition-all cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.35)] shrink-0 whitespace-nowrap"
              title="Trigger mock person detection event"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span>TEST EVENT</span>
            </button>

            {/* Premium Glassmorphism Theme Toggle Button [ ☀ / ☾ ] */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-white/5 hover:bg-white/12 border border-white/12 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-inner shrink-0 group overflow-hidden"
              title={`Switch to ${theme === 'dark' ? 'Light Aerospace' : 'Dark Command Center'} Mode`}
              aria-label="Toggle Dark/Light Theme"
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Sun 
                  className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${
                    theme === 'light' 
                      ? 'rotate-0 scale-100 opacity-100' 
                      : '-rotate-90 scale-0 opacity-0'
                  }`} 
                />
                <Moon 
                  className={`w-4 h-4 text-cyan-300 absolute transition-all duration-300 transform ${
                    theme === 'dark' 
                      ? 'rotate-0 scale-100 opacity-100' 
                      : 'rotate-90 scale-0 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* Vertical Glass Divider */}
          <div className="h-7 w-px bg-white/15 hidden sm:block shrink-0" />

          {/* ONLINE Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-full status-pill-online text-xs font-mono font-bold shrink-0 whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-amber-400'}`} />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* Circular Glass Notification Bell Icon */}
          <div className="relative shrink-0">
            <button 
              className="w-8.5 h-8.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer shadow-inner shrink-0"
              title={hasActiveAlerts ? 'Active Alerts Pending' : 'Notifications'}
            >
              <Bell className="w-4 h-4 shrink-0" />
              {hasActiveAlerts && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 pulse-red-indicator border-2 border-[#0a1422]" />
              )}
            </button>
          </div>

          {/* Profile Circle & Dropdown Arrow */}
          <div className="flex items-center gap-1 cursor-pointer group shrink-0">
            <div className="w-8.5 h-8.5 rounded-full bg-blue-950/80 border border-blue-400/40 text-blue-200 font-bold text-xs flex items-center justify-center shadow-inner group-hover:border-blue-400/80 transition-all shrink-0">
              S
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors shrink-0" />
          </div>

        </div>

      </div>
    </header>
  );
}
