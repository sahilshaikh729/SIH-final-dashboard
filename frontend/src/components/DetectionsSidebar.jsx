import React from 'react';
import { 
  UserCheck, 
  Flame, 
  Waves, 
  Wind, 
  Mountain, 
  Package, 
  Radio,
  CloudSun
} from 'lucide-react';

export default function DetectionsSidebar({ 
  events = [], 
  mapFilter = 'ALL', 
  onSelectCategoryFilter,
  onNavigateToCategoryView
}) {
  const activeEvents = events.filter(e => e.status !== 'RESOLVED');

  const getCount = (category) => {
    if (category === 'ALL') return activeEvents.length;
    return activeEvents.filter(e => (e.hazard || '').toLowerCase() === category.toLowerCase()).length;
  };

  const categories = [
    { id: 'person', label: 'PERSON (RESCUE)', icon: UserCheck, color: 'text-red-400', badgeColor: 'bg-red-500/25 text-red-300 border-red-500/40' },
    { id: 'fire', label: 'Fire', icon: Flame, color: 'text-orange-400', badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    { id: 'flood', label: 'Flood', icon: Waves, color: 'text-cyan-400', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'smoke', label: 'Smoke', icon: Wind, color: 'text-slate-400', badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    { id: 'landslide', label: 'Landslide', icon: Mountain, color: 'text-amber-400', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'debris', label: 'Debris', icon: Package, color: 'text-blue-400', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  ];

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-0.5 select-none font-sans min-w-0">
      
      {/* 1. DETECTIONS PANEL */}
      <div className="glass-panel p-3.5 space-y-2.5 shadow-lg min-w-0">
        <div className="flex items-center justify-between border-b border-white/8 pb-2 min-w-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-4 h-4 text-[#22d3ee] shrink-0" />
            <h2 className="text-[11px] xl:text-xs font-display font-semibold uppercase tracking-wider text-[#f2f5f8] truncate">
              DETECTIONS
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#141e2c] border border-white/8 text-[#22d3ee] shrink-0 whitespace-nowrap">
            {activeEvents.length} ACTIVE
          </span>
        </div>

        {/* Category Rows */}
        <div className="space-y-1.5 min-w-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = mapFilter.toLowerCase() === cat.id;
            const count = getCount(cat.id);
            const isPerson = cat.id === 'person';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategoryFilter(cat.id)}
                onDoubleClick={() => onNavigateToCategoryView && onNavigateToCategoryView(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border min-w-0 gap-2 ${
                  isSelected
                    ? isPerson
                      ? 'bg-red-500/20 text-white border-red-500/40 relative overflow-hidden'
                      : 'bg-blue-500/20 text-white border-blue-400/40'
                    : isPerson
                    ? 'bg-red-950/15 text-red-200 border-red-900/30 hover:bg-red-900/25'
                    : 'bg-[#141e2c] text-[#f2f5f8] border-white/6 hover:bg-[#182231]'
                }`}
              >
                {/* Left Accent Highlight Bar */}
                {isSelected && isPerson && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                  <span className="tracking-wide text-xs truncate font-sans font-medium">{cat.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 whitespace-nowrap ${cat.badgeColor}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MISSION INFO PANEL */}
      <div className="glass-panel p-3.5 space-y-2.5 shadow-lg min-w-0">
        <div className="flex items-center justify-between border-b border-white/8 pb-2 min-w-0 gap-2">
          <h2 className="text-[11px] xl:text-xs font-display font-semibold uppercase tracking-wider text-[#f2f5f8] truncate">
            MISSION INFO
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-600/20 text-blue-300 border border-blue-400/30 shrink-0 whitespace-nowrap">
            ACTIVE
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[#8d99a8] font-sans text-xs min-w-0 truncate">Current Mission:</span>
            <span className="text-slate-100 font-bold shrink-0">TEST EVENT</span>
          </div>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[#8d99a8] font-sans text-xs min-w-0 truncate">Area of Operation:</span>
            <span className="text-[#22d3ee] font-bold shrink-0">Nepal</span>
          </div>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[#8d99a8] font-sans text-xs min-w-0 truncate">Mission Start:</span>
            <span className="text-slate-100 font-bold shrink-0 whitespace-nowrap">20 Sep 2026, 01:20 AM</span>
          </div>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[#8d99a8] font-sans text-xs min-w-0 truncate">Active Since:</span>
            <span className="text-emerald-400 font-bold shrink-0">00:04:25</span>
          </div>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[#8d99a8] font-sans text-xs min-w-0 truncate">Detections:</span>
            <span className="text-slate-100 font-bold shrink-0">{events.length || 100}</span>
          </div>
        </div>

        {/* Thumbnail Satellite Card */}
        <div className="p-2 rounded-xl bg-[#141e2c] border border-white/8 flex items-center gap-2.5 min-w-0 shadow-sm">
          <img src="/hero_drone.jpg" alt="Aerial Surveillance" className="w-11 h-9 object-cover rounded-lg border border-white/10 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] font-mono font-bold text-slate-100 uppercase truncate">AI-POWERED SURVEILLANCE</div>
            <div className="text-[9px] text-[#8d99a8] truncate">From sky to safety</div>
          </div>
        </div>
      </div>

      {/* 3. WEATHER / ENVIRONMENT PANEL */}
      <div className="glass-panel p-3.5 shadow-lg min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <CloudSun className="w-5.5 h-5.5 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-lg font-bold font-mono text-slate-100 truncate">24°C</div>
              <div className="text-[10px] text-slate-400 font-sans truncate">Mostly Clear</div>
            </div>
          </div>

          <div className="text-[10px] font-mono space-y-0.5 text-right text-slate-300 shrink-0 whitespace-nowrap">
            <div>Wind: <span className="text-cyan-400 font-bold">12 km/h</span></div>
            <div>Humidity: <span className="text-slate-100 font-bold">62%</span></div>
            <div>Visibility: <span className="text-emerald-400 font-bold">10 km</span></div>
          </div>
        </div>
      </div>

    </div>
  );
}
