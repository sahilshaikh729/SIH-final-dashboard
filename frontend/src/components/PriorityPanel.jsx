import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ChevronRight, 
  User, 
  Flame, 
  Waves, 
  Wind, 
  Mountain, 
  Package, 
  ArrowRight
} from 'lucide-react';

function getHazardIcon(hazard) {
  const h = (hazard || '').toLowerCase();
  switch (h) {
    case 'person': return User;
    case 'fire': return Flame;
    case 'flood': return Waves;
    case 'smoke': return Wind;
    case 'landslide': return Mountain;
    case 'debris': return Package;
    default: return AlertTriangle;
  }
}

export default function PriorityPanel({ 
  events = [], 
  selectedEvent, 
  onSelectPriorityEvent, 
  onSelectPriorityCategory,
  onClearFilter,
  mapFilter
}) {
  const activeEvents = events.filter(e => e.status !== 'RESOLVED');

  const highEvents = activeEvents.filter(e => e.priority === 'HIGH');
  const mediumEvents = activeEvents.filter(e => e.priority === 'MEDIUM');
  const lowEvents = activeEvents.filter(e => e.priority === 'LOW');

  const renderPrioritySection = (priorityKey, title, items, textClass, borderAccent, bgBadge) => {
    return (
      <div className="p-2.5 rounded-xl bg-[#141e2c] border border-white/8 space-y-1.5 min-w-0 shadow-sm">
        <div className="flex items-center justify-between min-w-0 gap-2">
          <div className={`flex items-center gap-1.5 font-semibold text-xs min-w-0 ${textClass}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${borderAccent}`} />
            <span className="truncate">{title} Priority</span>
          </div>
          <button
            onClick={() => onSelectPriorityCategory && onSelectPriorityCategory(priorityKey)}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 transition-colors ${bgBadge}`}
          >
            {items.length}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-[10px] text-[#8d99a8] italic py-0.5">No active {title.toLowerCase()} events</div>
        ) : (
          <div className="space-y-1 min-w-0">
            {items.slice(0, 3).map((evt) => {
              const isSelected = selectedEvent && selectedEvent.event_id === evt.event_id && mapFilter === 'SINGLE_EVENT';
              const Icon = getHazardIcon(evt.hazard);
              const confPct = Math.round((evt.confidence || 0) * 100);
              const formattedTime = evt.timestamp 
                ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '01:24 AM';

              return (
                <button
                  key={evt.event_id}
                  onClick={() => onSelectPriorityEvent(evt)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer border text-left min-w-0 gap-1.5 ${
                    isSelected
                      ? 'bg-blue-500/20 border-blue-400/40 text-white font-bold'
                      : 'bg-[#182231] hover:bg-[#1e2a3c] border-white/6 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${textClass}`} />
                    <span className="font-mono font-bold text-[11px] truncate">
                      {(evt.hazard || 'EVT').toUpperCase()}-{evt.event_id.slice(-4)}
                    </span>
                    <span className="text-[10px] text-[#8d99a8] font-mono shrink-0">
                      {confPct}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <span className="text-[10px] text-[#8d99a8] font-mono">
                      {formattedTime}
                    </span>
                    <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-[#22d3ee]' : 'text-slate-500'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <div className="text-right pt-0.5">
            <button 
              onClick={() => onSelectPriorityCategory && onSelectPriorityCategory(priorityKey)}
              className="text-[10px] font-semibold text-[#8d99a8] hover:text-[#22d3ee] inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-0.5 select-none font-sans min-w-0">
      
      {/* 1. PRIORITY EVENTS PANEL */}
      <div className="glass-panel p-3.5 space-y-2.5 shadow-lg min-w-0">
        <div className="flex items-center justify-between border-b border-white/8 pb-2 min-w-0 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <h2 className="text-[11px] xl:text-xs font-display font-semibold uppercase tracking-wider text-[#f2f5f8] truncate">
              PRIORITY EVENTS
            </h2>
          </div>
          <button
            onClick={onClearFilter}
            className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 border border-blue-500/30 cursor-pointer shrink-0 whitespace-nowrap"
          >
            ALL ({activeEvents.length})
          </button>
        </div>

        <div className="space-y-2 min-w-0">
          {renderPrioritySection('HIGH_PRIORITY', 'HIGH', highEvents, 'text-red-400', 'bg-red-500', 'bg-red-500/20 text-red-300 border-red-500/30')}
          {renderPrioritySection('MEDIUM_PRIORITY', 'MEDIUM', mediumEvents, 'text-amber-400', 'bg-amber-500', 'bg-amber-500/20 text-amber-300 border-amber-500/30')}
          {renderPrioritySection('LOW_PRIORITY', 'LOW', lowEvents, 'text-[#22d3ee]', 'bg-[#22d3ee]', 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/30')}
        </div>
      </div>

    </div>
  );
}
