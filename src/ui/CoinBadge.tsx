import clsx from 'clsx';

interface CoinBadgeProps {
  count: number;
  className?: string;
}

export function CoinBadge({ count, className }: CoinBadgeProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5',
        'bg-accent/20 text-accent rounded-round font-display',
        'border-2 border-accent/40',
        className
      )}
      role="status"
      aria-label={`${count} coins`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-bg)"
        >
          $
        </text>
      </svg>
      <span className="tabular-nums font-bold">{count}</span>
    </div>
  );
}
