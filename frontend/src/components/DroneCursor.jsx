import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cursor } from './core/cursor';

/**
 * Premium Mini Reconnaissance Drone Custom Cursor Component
 */
export default function DroneCursor() {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, [data-id], .leaflet-interactive, .glass-panel-hover'
      );

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <Cursor
      attachToParent={false}
      springConfig={{
        bounce: 0.05,
        duration: 0.15,
      }}
      transition={{
        ease: 'easeOut',
        duration: 0.15,
      }}
    >
      <motion.div
        animate={{
          scale: isHovering ? 1.25 : 0.95,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className="pointer-events-none select-none flex items-center justify-center"
      >
        {/* Premium Mini Reconnaissance Drone Visual */}
        <div
          className={`relative flex items-center justify-center p-2 rounded-2xl transition-all duration-300 ${
            isHovering
              ? 'bg-[#0a2034]/85 border border-cyan-400/70 shadow-[0_0_22px_rgba(6,182,212,0.65)] backdrop-blur-md'
              : 'bg-[#061220]/75 border border-blue-400/35 shadow-[0_0_12px_rgba(59,130,246,0.35)] backdrop-blur-sm'
          }`}
        >
          {/* Quadcopter UAV SVG */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform duration-300"
          >
            {/* Four Rotors */}
            <circle cx="7" cy="7" r="4.5" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" className="animate-[drone-prop-spin_0.35s_linear_infinite]" />
            <circle cx="25" cy="7" r="4.5" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" className="animate-[drone-prop-spin_0.35s_linear_infinite]" />
            <circle cx="7" cy="25" r="4.5" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" className="animate-[drone-prop-spin_0.35s_linear_infinite]" />
            <circle cx="25" cy="25" r="4.5" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 2" className="animate-[drone-prop-spin_0.35s_linear_infinite]" />

            {/* Arm Beams */}
            <line x1="9.5" y1="9.5" x2="22.5" y2="22.5" stroke="#475569" strokeWidth="2" />
            <line x1="22.5" y1="9.5" x2="9.5" y2="22.5" stroke="#475569" strokeWidth="2" />

            {/* Drone Fuselage */}
            <rect x="11" y="11" width="10" height="10" rx="3" fill="#0c2032" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Front Camera Beacon */}
            <circle cx="16" cy="11" r="1.5" fill="#38bdf8" className="animate-pulse" />
            <circle cx="16" cy="16" r="2" fill="#06b6d4" />
          </svg>
        </div>
      </motion.div>
    </Cursor>
  );
}
