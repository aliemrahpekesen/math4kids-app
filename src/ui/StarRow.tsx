import clsx from 'clsx';

interface StarRowProps {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

const SIZE_CLS = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
} as const;

function Star({ filled, sizeCls }: { filled: boolean; sizeCls: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clsx(sizeCls, filled ? 'text-star-filled' : 'text-star-empty')}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function StarRow({
  stars,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: StarRowProps) {
  const sizeCls = SIZE_CLS[size];
  return (
    <div
      className={clsx('inline-flex gap-1', className)}
      role="img"
      aria-label={ariaLabel ?? `${stars} of 3 stars`}
    >
      {[1, 2, 3].map((idx) => (
        <Star key={idx} filled={idx <= stars} sizeCls={sizeCls} />
      ))}
    </div>
  );
}
