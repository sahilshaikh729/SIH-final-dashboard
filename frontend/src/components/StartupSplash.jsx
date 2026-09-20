import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle2 } from 'lucide-react';

export default function StartupSplash({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0: Init text, 1: Drone approach, 2: System indicators, 3: Fade out
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // 0.0s -> Start Phase 0 (Init text)
    // 0.5s -> Phase 1 (Drone approach & hover)
    const t1 = setTimeout(() => setPhase(1), 500);

    // 1.5s -> Phase 2 (System indicators & Ground station rescue monitoring title)
    const t2 = setTimeout(() => setPhase(2), 1500);

    // 2.1s -> Phase 3 (Smooth fade out)
    const t3 = setTimeout(() => setPhase(3), 2100);

    // 2.5s -> Complete splash & remove overlay
    const t4 = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#060911] flex flex-col items-center justify-center select-none font-sans overflow-hidden transition-opacity duration-500 ${
      phase === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md px-6">
        
        {/* Animated Drone Graphic Container */}
        <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
          
          {/* Subtle Radar Scanning Rings */}
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-30" />
          <div className="absolute inset-4 rounded-full border border-blue-400/20" />
          
          {/* Animated Drone SVG */}
          <div className={`transition-all duration-1000 ease-out transform ${
            phase === 0 ? 'scale-50 opacity-0 translate-y-8' :
            phase === 1 ? 'scale-100 opacity-100 translate-y-0 animate-[drone-hover-float_2.8s_ease-in-out_infinite]' :
            'scale-105 opacity-100 translate-y-0 animate-[drone-hover-float_2.8s_ease-in-out_infinite]'
          }`}>
            <svg viewBox="0 0 100 100" width="110" height="110" className="drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]">
              {/* Drone Arms */}
              <line x1="22" y1="22" x2="78" y2="78" stroke="#334155" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="78" y1="22" x2="22" y2="78" stroke="#334155" strokeWidth="4.5" strokeLinecap="round"/>
              <line x1="22" y1="22" x2="78" y2="78" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="78" y1="22" x2="22" y2="78" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"/>

              {/* Rotors with spinning blades */}
              {[[22, 22], [78, 22], [22, 78], [78, 78]].map(([cx, cy], i) => (
                <g key={i} transform={`translate(${cx},${cy})`}>
                  <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5"/>
                  <g className="drone-propeller-blade">
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#60a5fa" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#3b82f6" strokeWidth="1" opacity="0.5"/>
                  </g>
                  <circle cx="0" cy="0" r="3" fill="#3b82f6"/>
                </g>
              ))}

              {/* Central Chassis Body */}
              <polygon points="50,26 68,44 68,64 50,74 32,64 32,44" fill="#090d16" stroke="#3b82f6" strokeWidth="2"/>
              <polygon points="50,22 56,32 44,32" fill="#60a5fa"/>
              <circle cx="50" cy="50" r="4.5" fill="#10b981" className="drone-led-beacon"/>
            </svg>
          </div>
        </div>

        {/* Phase Text */}
        <div className="space-y-1.5 transition-all duration-300">
          <div className="flex items-center justify-center gap-2">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
            <h1 className="text-base font-extrabold tracking-widest text-slate-100 uppercase font-sans">
              GROUND STATION
            </h1>
          </div>

          <p className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase font-sans">
            {phase < 2 ? 'INITIALIZING RESCUE MONITORING...' : 'RESCUE MONITORING'}
          </p>
        </div>

        {/* System Initialization Indicators (Phase >= 2) */}
        <div className={`mt-5 flex items-center justify-center gap-3 transition-all duration-500 text-[10px] font-mono ${
          phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          <div className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>TELEMETRY: CONNECTED</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span>GPS: 3D LOCK</span>
          </div>
        </div>

        {/* Boot Progress Line */}
        <div className="w-48 h-1 bg-slate-900 rounded-full mt-6 overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: phase === 0 ? '20%' : phase === 1 ? '65%' : '100%' 
            }}
          />
        </div>

      </div>

    </div>
  );
}
