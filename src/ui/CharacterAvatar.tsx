import clsx from 'clsx';

/**
 * Avatar keys are `<theme>-<slug>`. Each maps to a Fluent Emoji SVG at
 * `/avatars/<theme>/<slug>.svg`. Themes are grouped so the onboarding
 * picker can present them in 4 labeled sections.
 */
export type AvatarKey =
  // Space — 6
  | 'space-astronaut'
  | 'space-alien'
  | 'space-robot'
  | 'space-rocket'
  | 'space-planet'
  | 'space-ufo'
  // Jungle — 6
  | 'jungle-fox'
  | 'jungle-lion'
  | 'jungle-monkey'
  | 'jungle-tiger'
  | 'jungle-parrot'
  | 'jungle-elephant'
  // Ocean — 6
  | 'ocean-fish'
  | 'ocean-octopus'
  | 'ocean-whale'
  | 'ocean-crab'
  | 'ocean-dolphin'
  | 'ocean-shark'
  // Candy — 6
  | 'candy-cupcake'
  | 'candy-doughnut'
  | 'candy-icecream'
  | 'candy-lollipop'
  | 'candy-candy'
  | 'candy-cake';

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

const SIZE_INNER_PADDING = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
} as const;

/** Convert avatar key → public-folder SVG path. */
function avatarPath(key: AvatarKey): string {
  const [theme, slug] = key.split('-', 2);
  return `/avatars/${theme}/${slug}.svg`;
}

export function CharacterAvatar({
  avatarKey,
  size = 'md',
  className,
  alt,
}: CharacterAvatarProps) {
  const [, slug] = avatarKey.split('-', 2);
  return (
    <div
      className={clsx(
        SIZE_CLS[size],
        SIZE_INNER_PADDING[size],
        'rounded-round bg-surface/60 flex items-center justify-center shadow-card overflow-hidden',
        className
      )}
      role="img"
      aria-label={alt ?? `${slug ?? avatarKey} avatar`}
    >
      <img
        src={avatarPath(avatarKey)}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

/** All 24 avatar keys, in theme order. */
// eslint-disable-next-line react-refresh/only-export-components -- constant colocated with component for ergonomics
export const AVATAR_KEYS: AvatarKey[] = [
  'space-astronaut',
  'space-alien',
  'space-robot',
  'space-rocket',
  'space-planet',
  'space-ufo',
  'jungle-fox',
  'jungle-lion',
  'jungle-monkey',
  'jungle-tiger',
  'jungle-parrot',
  'jungle-elephant',
  'ocean-fish',
  'ocean-octopus',
  'ocean-whale',
  'ocean-crab',
  'ocean-dolphin',
  'ocean-shark',
  'candy-cupcake',
  'candy-doughnut',
  'candy-icecream',
  'candy-lollipop',
  'candy-candy',
  'candy-cake',
];

/** Avatar keys grouped by theme — used by the onboarding picker. */
// eslint-disable-next-line react-refresh/only-export-components -- constant colocated with component for ergonomics
export const AVATARS_BY_THEME = {
  space: [
    'space-astronaut',
    'space-alien',
    'space-robot',
    'space-rocket',
    'space-planet',
    'space-ufo',
  ],
  jungle: [
    'jungle-fox',
    'jungle-lion',
    'jungle-monkey',
    'jungle-tiger',
    'jungle-parrot',
    'jungle-elephant',
  ],
  ocean: [
    'ocean-fish',
    'ocean-octopus',
    'ocean-whale',
    'ocean-crab',
    'ocean-dolphin',
    'ocean-shark',
  ],
  candy: [
    'candy-cupcake',
    'candy-doughnut',
    'candy-icecream',
    'candy-lollipop',
    'candy-candy',
    'candy-cake',
  ],
} satisfies Record<string, AvatarKey[]>;

/** Theme labels for the picker section headings. */
// eslint-disable-next-line react-refresh/only-export-components -- constant colocated with component for ergonomics
export const AVATAR_THEME_KEYS = ['space', 'jungle', 'ocean', 'candy'] as const;
