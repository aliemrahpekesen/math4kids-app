import clsx from 'clsx';
import { TouchTarget } from './TouchTarget';

interface NumeralTileProps {
  value: number;
  selected?: boolean;
  onSelect?: () => void;
  size?: 'md' | 'lg';
  className?: string;
}

export function NumeralTile({
  value,
  selected,
  onSelect,
  size = 'md',
  className,
}: NumeralTileProps) {
  return (
    <TouchTarget
      onClick={onSelect}
      aria-label={`Number ${value}`}
      aria-pressed={selected}
      className={clsx(
        'rounded-soft font-display tabular-nums',
        size === 'lg' ? 'text-5xl min-w-[80px] min-h-[80px]' : 'text-3xl',
        selected
          ? 'bg-accent text-accent-fg shadow-glow ring-4 ring-accent/60'
          : 'bg-surface text-fg hover:bg-primary hover:text-primary-fg',
        className
      )}
    >
      {value}
    </TouchTarget>
  );
}
