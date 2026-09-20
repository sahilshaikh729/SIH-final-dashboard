import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * Fixed Drone Icon Component (Mouse tracking removed)
 */
export function Cursor({
  children,
  className,
  transition,
}) {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <motion.div
      ref={cursorRef}
      className={cn('pointer-events-none fixed bottom-6 right-6 z-40', className)}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={transition || { ease: 'easeOut', duration: 0.15 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

