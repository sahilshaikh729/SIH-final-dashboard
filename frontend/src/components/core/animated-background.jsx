import React, { Children, cloneElement, useEffect, useState, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * AnimatedBackground component for smooth spring active/hover pill transitions
 */
export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition = {
    type: 'spring',
    bounce: 0.2,
    duration: 0.3,
  },
  enableHover = true,
}) {
  const [activeId, setActiveId] = useState(null);
  const uniqueId = useId();

  const handleSetActiveId = (id) => {
    setActiveId(id);
    if (onValueChange) {
      onValueChange(id);
    }
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [defaultValue]);

  return Children.map(children, (child, index) => {
    if (!child) return null;
    const id = child.props['data-id'];

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {
          onClick: () => handleSetActiveId(id),
        };

    return cloneElement(
      child,
      {
        key: id || index,
        className: cn('relative inline-flex items-center justify-center', child.props.className),
        'data-checked': activeId === id ? 'true' : 'false',
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn('absolute inset-0 z-0', className)}
              transition={transition}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10 flex items-center gap-2">{child.props.children}</span>
      </>
    );
  });
}
