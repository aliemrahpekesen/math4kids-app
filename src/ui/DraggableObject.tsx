import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useMotionPreset } from '../hooks/useMotionPreset';

interface DraggableObjectProps {
  id: string;
  children: ReactNode;
  onDrop?: (id: string, targetId: string | null) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Pointer-based draggable wrapped with Framer Motion. Touch-friendly.
 * On drop, looks for the nearest element with `data-dropzone="id"` and
 * fires `onDrop(thisId, targetId | null)`.
 */
export function DraggableObject({
  id,
  children,
  onDrop,
  className,
  ariaLabel,
}: DraggableObjectProps) {
  const motionEnabled = useMotionPreset();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragSnapToOrigin
      whileDrag={motionEnabled ? { scale: 1.1, zIndex: 50 } : undefined}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_e, info) => {
        setIsDragging(false);
        if (!onDrop) return;
        const el = document.elementFromPoint(info.point.x, info.point.y);
        const dropzone = el?.closest('[data-dropzone]');
        const targetId = dropzone?.getAttribute('data-dropzone') ?? null;
        onDrop(id, targetId);
      }}
      role="button"
      aria-label={ariaLabel ?? `Drag ${id}`}
      aria-grabbed={isDragging}
      tabIndex={0}
      className={clsx(
        'touch-none select-none cursor-grab active:cursor-grabbing',
        'inline-flex items-center justify-center',
        'min-w-touch min-h-touch p-2 rounded-soft',
        'bg-surface text-fg shadow-card',
        isDragging && 'cursor-grabbing',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface DropZoneProps {
  id: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function DropZone({ id, children, className, active }: DropZoneProps) {
  return (
    <div
      data-dropzone={id}
      className={clsx(
        'border-4 border-dashed rounded-soft p-4 transition-colors',
        active ? 'border-success bg-success/10' : 'border-fg/30 bg-surface/30',
        className
      )}
    >
      {children}
    </div>
  );
}
