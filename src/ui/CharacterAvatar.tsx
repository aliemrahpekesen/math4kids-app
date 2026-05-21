import clsx from 'clsx';

export type AvatarKey =
  | 'fox'
  | 'panda'
  | 'owl'
  | 'bunny'
  | 'astronaut'
  | 'fish';

interface CharacterAvatarProps {
  avatarKey: AvatarKey;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  alt?: string;
}

const SIZE_CLS = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
} as const;

const EMOJI_BY_KEY: Record<AvatarKey, string> = {
  fox: '🦊',
  panda: '🐼',
  owl: '🦉',
  bunny: '🐰',
  astronaut: '🚀',
  fish: '🐟',
};

export function CharacterAvatar({
  avatarKey,
  size = 'md',
  className,
  alt,
}: CharacterAvatarProps) {
  return (
    <div
      className={clsx(
        SIZE_CLS[size],
        'rounded-round bg-surface/60 flex items-center justify-center',
        'shadow-card text-4xl',
        size === 'lg' && 'text-6xl',
        size === 'sm' && 'text-2xl',
        className
      )}
      role="img"
      aria-label={alt ?? `${avatarKey} avatar`}
    >
      {EMOJI_BY_KEY[avatarKey]}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- constant colocated with component for ergonomics
export const AVATAR_KEYS: AvatarKey[] = [
  'fox',
  'panda',
  'owl',
  'bunny',
  'astronaut',
  'fish',
];
