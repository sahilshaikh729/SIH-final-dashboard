import React, { createContext, useContext, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const DockContext = createContext({
  mouseX: null,
  magnification: 1.25,
  distance: 140,
});

export function Dock({
  children,
  className,
  magnification = 1.2,
  distance = 120,
  ...props
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          'flex h-14 xl:h-16 items-center justify-center gap-4 xl:gap-7 rounded-2xl px-5 py-1.5',
          'bg-[#111927]/90 backdrop-blur-md border border-white/8 shadow-lg',
          'transition-colors duration-300',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export function DockItem({
  children,
  className,
  onClick,
  isActive = false,
  ...props
}) {
  const ref = useRef(null);
  const { mouseX, magnification, distance } = useContext(DockContext);
  const [isHovered, setIsHovered] = useState(false);

  // Distance from mouse position X to element's horizontal center
  const distanceCalc = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Calculate target scale magnification based on distance
  const targetScale = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [1, magnification, 1]
  );

  const scale = useSpring(targetScale, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });

  return (
    <motion.button
      ref={ref}
      style={{ scale }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all cursor-pointer select-none whitespace-nowrap shrink-0 overflow-visible',
        isActive
          ? 'bg-white/10 text-white border border-white/20 shadow-md'
          : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { isHovered, isActive });
      })}
    </motion.button>
  );
}

export function DockIcon({ children, className, isActive }) {
  return (
    <span className={cn('flex items-center justify-center shrink-0 transition-transform duration-200', className)}>
      {children}
    </span>
  );
}

export function DockLabel({ children, className, isHovered }) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute -bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#050b14]/90 text-cyan-300 border border-cyan-400/30 shadow-lg whitespace-nowrap',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
