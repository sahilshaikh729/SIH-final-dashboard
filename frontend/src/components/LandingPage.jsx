import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  LayoutDashboard, 
  UserCheck, 
  History, 
  Bell, 
  ChevronRight, 
  ArrowRight,
  Navigation, 
  BatteryCharging, 
  Play,
  ShieldCheck,
  Sparkles,
  MapPin,
  Flame,
  Mouse
} from 'lucide-react';

export default function LandingPage({ 
  onLaunch, 
  activeTab, 
  setActiveTab, 
  dronePosition = null, 
  isConnected = true, 
  isOnline = true, 
  personCount = 0 
}) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [timeStr, setTimeStr] = useState('18 SEP 2026 21:42:17');

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        setTimeStr(`${dateStr} ${timeStr}`);
      } catch (err) {
        console.error('Clock update error:', err);
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLaunch = (tabId = null) => {
    if (tabId && setActiveTab) {
      setActiveTab(tabId);
    }
    setIsLaunching(true);
    setTimeout(() => {
      onLaunch();
    }, 650); // 650ms smooth transition timing
  };

  const batteryPct = dronePosition?.battery || 88;

  const navItems = [
    { id: 'dashboard', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'detections', label: 'DETECTION', icon: UserCheck, badge: personCount },
    { id: 'history', label: 'MISSIONS', icon: History },
    { id: 'receiver', label: 'NET & SiK SETUP', icon: Radio },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-command-center text-slate-100 font-sans select-none overflow-hidden flex flex-col justify-between p-4 md:p-6 transition-all duration-700 ease-out ${
        isLaunching ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. ATMOSPHERIC BACKGROUND SCENE WITH MOUNTAIN TERRAIN GLOW */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 pointer-events-none scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('/aegis_hero.jpg')` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-[#050b14]/85 to-[#040812] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      
      {/* Ambient Central Cyan Spotlight Behind Drone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 2. TOP FLOATING GLASS HEADER NAVIGATION BAR */}
      <header className="relative z-40 w-full max-w-[1920px] mx-auto space-y-2">
        <div className="flex items-center justify-between gap-4">
          
          {/* Top Left Branding */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(59,130,246,0.3)] p-1 overflow-hidden">
              <img 
                src="/rayo_lab_logo.png" 
                alt="RAYO LAB Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-slate-100 uppercase font-sans">
                SALVADOR
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase font-sans">
                RESCUE MONITORING
              </p>
            </div>
          </div>

          {/* Top Center Floating Glass Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full glass-header-bar shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLaunch(item.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-slate-200 hover:text-white hover:bg-white/10 border border-transparent transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Top Right Status & Profile */}
          <div className="flex items-center gap-3">
            {/* Connection Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full status-pill-online text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => handleLaunch('detections')}
                className="w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer shadow-inner"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 pulse-red-indicator border-2 border-[#050b14]" />
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-1 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-blue-950/80 border border-blue-400/40 text-blue-200 font-bold text-xs flex items-center justify-center shadow-inner group-hover:border-blue-400/80 transition-all">
                S
              </div>
            </div>
          </div>

        </div>

        {/* Subtitle Bar below Header */}
        <div className="hidden md:flex items-center justify-end text-[10px] font-mono text-slate-400 tracking-widest px-1">
          <div className="flex items-center gap-2">
            <span>{timeStr}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> MISSION READY
            </span>
          </div>
        </div>

      </header>

      {/* 3. HERO CENTER PIECE: OVERSIZED BACKGROUND TYPOGRAPHY + 3D DRONE HERO */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto min-h-0">
        
        {/* Oversized Background Typography (Sitting BEHIND Drone) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 overflow-hidden leading-none">
          
          <div className="text-center space-y-1 mb-2">
            <span className="text-xs font-mono font-bold tracking-[0.35em] text-cyan-400/90 uppercase">
              SIH-AEGIS-01
            </span>
            <p className="text-[10px] font-mono tracking-[0.4em] text-slate-400 uppercase">
              AUTONOMOUS RESPONSE UAV
            </p>
          </div>

          <h1 className="text-[12vw] xl:text-[13vw] font-black uppercase tracking-tighter text-slate-700/25 leading-[0.85] text-center font-sans drop-shadow-2xl">
            DISASTER
          </h1>
          <h1 className="text-[12vw] xl:text-[13vw] font-black uppercase tracking-tighter text-slate-700/25 leading-[0.85] text-center font-sans drop-shadow-2xl">
            RESPONSE
          </h1>
        </div>


        {/* 4. LEFT GLASSMORPHISM CARD (Shared .glass-panel system) */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
          <div className="glass-panel p-5 w-80 shadow-2xl space-y-3.5 border transition-all duration-300">
            <div>
              <p className="text-[9px] font-mono font-extrabold uppercase tracking-[0.25em] text-cyan-400">
                TACTICAL SURVEILLANCE
              </p>
              <h2 className="text-base font-extrabold tracking-wider text-slate-100 uppercase leading-tight mt-1">
                DISASTER RESPONSE<br />
                AERIAL MONITORING
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-cyan-500/60 pl-3 py-0.5">
              Autonomous aerial intelligence for rapid disaster assessment, person detection, and real-time rescue operations.
            </p>

            <button
              onClick={() => handleLaunch()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-button-primary text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer group"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>WATCH OVERVIEW</span>
              <ChevronRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 5. RIGHT GLASSMORPHISM CARD (Shared .glass-panel system) */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
          <div className="glass-panel p-5 w-76 shadow-2xl space-y-3.5 border transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                  DRONE-01
                </h3>
                <p className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                  RESPONSE UAV
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>

            {/* Live Telemetry Status Grid */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans text-[11px]">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" /> GPS:
                </span>
                <span className="text-slate-100 font-bold">CONNECTED</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" /> SiK LINK:
                </span>
                <span className="text-cyan-400 font-bold">READY</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans text-[11px]">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> BATTERY:
                </span>
                <span className="text-slate-100 font-bold">{batteryPct}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5 font-sans text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> MISSION:
                </span>
                <span className="text-cyan-300 font-bold">STANDBY</span>
              </div>
            </div>

            {/* Status Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>

          </div>
        </div>

        {/* 6. SMALL LOWER CARDS (BOTTOM CORNERS - Shared .glass-panel system) */}
        <div className="absolute left-4 md:left-8 bottom-16 z-30 hidden lg:block">
          <div className="glass-panel p-3 w-60 border flex items-center gap-3 shadow-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-100 uppercase tracking-wide">
                REAL-TIME INTELLIGENCE
              </p>
              <p className="text-[9px] text-slate-400 font-sans">
                From sky to safety
              </p>
            </div>
          </div>
        </div>

        <div className="absolute right-4 md:right-8 bottom-16 z-30 hidden lg:block">
          <div className="glass-panel p-3 w-60 border flex items-center gap-3 shadow-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-100 uppercase tracking-wide">
                DISASTER AREAS
              </p>
              <p className="text-[9px] text-slate-400 font-sans">
                Monitor · Detect · Respond
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 7. BOTTOM CTA & SCROLL INDICATOR */}
      <footer className="relative z-40 flex flex-col items-center justify-center gap-2 pb-1">
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-1 text-slate-400 text-[9px] font-mono tracking-widest uppercase">
          <Mouse className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>SCROLL TO EXPLORE</span>
        </div>

        {/* ENTER GROUND STATION Glass Button */}
        <button
          onClick={() => handleLaunch()}
          className="flex items-center gap-3 px-8 py-3.5 rounded-full glass-button-primary text-white text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>ENTER GROUND STATION</span>
          <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>

      {/* Very Bottom Footer Legal/Tagline Strip */}
      <div className="relative z-40 hidden md:flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-white/5 pt-2">
        <span>SIH 2026 | AI-POWERED AUTONOMOUS DISASTER RESPONSE DRONE</span>
        <span>PEOPLE | SAFETY | FASTER RESPONSE</span>
      </div>

    </div>
  );
}
