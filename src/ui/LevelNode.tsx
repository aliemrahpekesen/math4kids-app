import clsx from 'clsx';
import { TouchTarget } from './TouchTarget';
import { StarRow } from './StarRow';

export type LevelNodeState = 'locked' | 'available' | 'current' | 'completed';

interface LevelNodeProps {
  levelId: number;
  state: LevelNodeState;
  stars: 0 | 1 | 2 | 3;
  onSelect?: () => void;
  className?: string;
  isFinal?: boolean;
}

const STATE_CLS: Record<LevelNodeState, string> = {
  locked: 'bg-surface/50 text-fg/40 cursor-not-allowed',
  available: 'bg-primary/80 text-primary-fg hover:bg-primary',
  current:
    'bg-accent text-accent-fg shadow-glow ring-4 ring-accent/40 animate-pulse',
  completed: 'bg-success/80 text-bg',
};

export function LevelNode({
  levelId,
  state,
  stars,
  onSelect,
  className,
  isFinal,
}: LevelNodeProps) {
  const disabled = state === 'locked';
  return (
    <div className={clsx('flex flex-col items-center gap-1', className)}>
      <TouchTarget
        disabled={disabled}
        onClick={onSelect}
        aria-label={`Level ${levelId} — ${state}, ${stars} of 3 stars${isFinal ? ' (final challenge)' : ''}`}
        className={clsx(
          'w-16 h-16 rounded-round font-display text-xl',
          STATE_CLS[state],
          isFinal && 'ring-4 ring-accent'
        )}
      >
        {state === 'locked' ? '🔒' : levelId}
      </TouchTarget>
      {state !== 'locked' && stars > 0 && <StarRow stars={stars} size="sm" />}
    </div>
  );
}
