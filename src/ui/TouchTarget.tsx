import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface TouchTargetProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * Enforces the ≥56×56 CSS px minimum touch target for ages 4–6
 * (above WCAG 44, above Material 48). Visible focus ring.
 */
export function TouchTarget({
  children,
  className,
  type = 'button',
  ...rest
}: TouchTargetProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center',
        'min-w-touch min-h-touch px-4 py-2',
        'rounded-soft font-display',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/70',
        'transition-transform duration-150 active:scale-95',
        'disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
