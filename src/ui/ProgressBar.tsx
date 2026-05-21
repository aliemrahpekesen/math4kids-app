import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = (clamped / max) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={clsx(
        'w-full h-3 rounded-round bg-fg/15 overflow-hidden',
        className
      )}
    >
      <div
        className="h-full bg-success rounded-round transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
