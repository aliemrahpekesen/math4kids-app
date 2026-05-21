import { useEffect, type ReactNode } from 'react';
import clsx from 'clsx';

interface ToastProps {
  open: boolean;
  onDismiss: () => void;
  durationMs?: number;
  variant?: 'info' | 'success' | 'warning';
  children: ReactNode;
}

const VARIANT_CLS = {
  info: 'bg-surface text-fg',
  success: 'bg-success text-bg',
  warning: 'bg-warning text-bg',
} as const;

export function Toast({
  open,
  onDismiss,
  durationMs = 3000,
  variant = 'info',
  children,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [open, durationMs, onDismiss]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-40',
        'rounded-soft shadow-card px-5 py-3 font-display',
        VARIANT_CLS[variant]
      )}
    >
      {children}
    </div>
  );
}
