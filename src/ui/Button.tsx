import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { TouchTarget } from './TouchTarget';

type Variant = 'primary' | 'accent' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  'aria-label'?: string;
}

const VARIANT_CLS: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg shadow-card hover:brightness-110',
  accent: 'bg-accent text-accent-fg shadow-glow hover:brightness-110',
  ghost: 'bg-transparent text-fg border-2 border-fg/30 hover:bg-fg/10',
  danger: 'bg-danger text-white hover:brightness-110',
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <TouchTarget className={clsx(VARIANT_CLS[variant], className)} {...rest}>
      {children}
    </TouchTarget>
  );
}
