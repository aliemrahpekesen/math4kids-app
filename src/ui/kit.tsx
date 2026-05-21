/**
 * Math4Kids UI primitives — chunky, toy-like. Ported from design_files/kit.jsx.
 * Components read theme tokens via React context (useTheme) so inline SVG
 * fills and shadow strings stay precise.
 */
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { useTheme } from '../themes/ThemeProvider';
import { REWARD } from '../themes/types';
import { IconLock, IconSound } from './icons';

// ─────────────────────────────────────────────────────────────
// ChunkyButton — the puffy 3D toy button used everywhere
// ─────────────────────────────────────────────────────────────
type ChunkyVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'success'
  | 'danger'
  | 'plain';
type ChunkySize = 'sm' | 'md' | 'lg' | 'xl';

interface ChunkyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ChunkyVariant;
  size?: ChunkySize;
  fullWidth?: boolean;
  icon?: ReactNode;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ChunkyButton({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth,
  icon,
  style = {},
  ...rest
}: ChunkyButtonProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  const palettes: Record<
    ChunkyVariant,
    { bg: string; fg: string; shadow: string }
  > = {
    primary: { bg: c.accent, fg: '#fff', shadow: c.accentDark },
    secondary: { bg: '#fff', fg: c.accentDark, shadow: c.accentSoft },
    success: { bg: c.success, fg: '#fff', shadow: '#15803D' },
    ghost: { bg: 'transparent', fg: c.accentDark, shadow: 'transparent' },
    danger: { bg: '#F87171', fg: '#fff', shadow: '#B91C1C' },
    plain: { bg: '#F1F5F9', fg: '#0F172A', shadow: '#CBD5E1' },
  };
  const p = palettes[variant];
  const sizes = {
    sm: { px: 16, py: 10, fz: 16, br: 14, sh: 4 },
    md: { px: 22, py: 14, fz: 18, br: 16, sh: 5 },
    lg: { px: 26, py: 18, fz: 22, br: 20, sh: 6 },
    xl: { px: 28, py: 22, fz: 26, br: 24, sh: 7 },
  };
  const s = sizes[size];
  return (
    <button
      {...rest}
      style={{
        appearance: 'none',
        border: 'none',
        cursor: 'pointer',
        background: p.bg,
        color: p.fg,
        fontFamily: tokens.tokens.font.display,
        fontWeight: 800,
        fontSize: s.fz,
        padding: `${s.py}px ${s.px}px`,
        borderRadius: s.br,
        boxShadow:
          variant === 'ghost'
            ? 'none'
            : `inset 0 -${s.sh}px 0 ${p.shadow}, 0 4px 0 rgba(0,0,0,0.06), 0 6px 12px rgba(0,0,0,0.08)`,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        letterSpacing: '0.01em',
        minHeight: 56,
        transition: 'transform .08s',
        ...style,
      }}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children !== undefined && children !== '' && <span>{children}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Star + StarRow — 5-point yellow stars, with optional bounce animation
// ─────────────────────────────────────────────────────────────
interface StarProps {
  size?: number;
  on?: boolean;
  bounce?: boolean;
  delay?: number;
}

export function Star({ size = 28, on = true, bounce = false, delay = 0 }: StarProps) {
  const fill = on ? REWARD.star : REWARD.starEmpty;
  const stroke = on ? REWARD.starShade : '#9CA3AF';
  const gradId = `stg-${size}-${on ? 1 : 0}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={
        bounce
          ? { animation: `m4k-bounce 0.9s ${delay}s ease-out both` }
          : undefined
      }
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={on ? '#FEF08A' : '#F3F4F6'} />
          <stop offset="1" stopColor={fill} />
        </linearGradient>
      </defs>
      <path
        d="M20 3l5.3 10.7L37 15.4l-8.5 8.3 2 11.7L20 29.8 9.5 35.4l2-11.7L3 15.4l11.7-1.7L20 3z"
        fill={`url(#${gradId})`}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 11l3-5 3 5"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

interface StarRowProps {
  filled?: 0 | 1 | 2 | 3;
  size?: number;
  bounce?: boolean;
  className?: string;
}

export function StarRow({
  filled = 3,
  size = 22,
  bounce = false,
  className,
}: StarRowProps) {
  return (
    <div className={className} style={{ display: 'inline-flex', gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          size={size}
          on={i < filled}
          bounce={bounce}
          delay={i * 0.15}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CoinIcon + CoinBadge
// ─────────────────────────────────────────────────────────────
export function CoinIcon({ size = 26 }: { size?: number }) {
  const { tokens } = useTheme();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill={REWARD.coinShade} />
      <circle cx="20" cy="19" r="15" fill={REWARD.coin} />
      <circle
        cx="20"
        cy="19"
        r="11"
        fill="none"
        stroke={REWARD.coinShade}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontFamily={tokens.tokens.font.display}
        fontWeight="900"
        fontSize="16"
        fill="#fff"
      >
        ★
      </text>
    </svg>
  );
}

interface CoinBadgeProps {
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function CoinBadge({ count = 0, size = 'md', className }: CoinBadgeProps) {
  const { tokens } = useTheme();
  const dims =
    size === 'sm'
      ? { h: 36, fz: 16, ic: 22, px: 8, pr: 12 }
      : { h: 44, fz: 20, ic: 28, px: 10, pr: 14 };
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: dims.h,
        padding: `0 ${dims.pr}px 0 ${dims.px}px`,
        borderRadius: 999,
        background: '#fff',
        boxShadow:
          'inset 0 -3px 0 rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.10)',
        fontFamily: tokens.tokens.font.display,
        fontWeight: 800,
        fontSize: dims.fz,
        color: '#B45309',
      }}
    >
      <CoinIcon size={dims.ic} />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chest — three tiers (bronze / silver / gold) × three states (locked / unlocked / open)
// ─────────────────────────────────────────────────────────────
export type ChestTier = 'bronze' | 'silver' | 'gold';
export type ChestState = 'locked' | 'unlocked' | 'open';

const CHEST_TIERS: Record<
  ChestTier,
  {
    wood: string;
    woodDark: string;
    woodLight: string;
    metal: string;
    metalDark: string;
    metalLight: string;
    gem: string;
    label: string;
  }
> = {
  bronze: {
    wood: '#A16207',
    woodDark: '#5C2E0E',
    woodLight: '#D97706',
    metal: '#B45309',
    metalDark: '#7C2D12',
    metalLight: '#FBBF24',
    gem: '#F87171',
    label: 'Bronz',
  },
  silver: {
    wood: '#475569',
    woodDark: '#1E293B',
    woodLight: '#64748B',
    metal: '#CBD5E1',
    metalDark: '#64748B',
    metalLight: '#F1F5F9',
    gem: '#60A5FA',
    label: 'Gümüş',
  },
  gold: {
    wood: '#854D0E',
    woodDark: '#451A03',
    woodLight: '#A16207',
    metal: '#FACC15',
    metalDark: '#B45309',
    metalLight: '#FEF08A',
    gem: '#A855F7',
    label: 'Altın',
  },
};

interface ChestProps {
  size?: number;
  state?: ChestState;
  tier?: ChestTier;
}

export function Chest({
  size = 64,
  state = 'unlocked',
  tier = 'bronze',
}: ChestProps) {
  const c = CHEST_TIERS[tier];
  const wood = state === 'locked' ? '#94A3B8' : c.wood;
  const woodDark = state === 'locked' ? '#475569' : c.woodDark;
  const metal = state === 'locked' ? '#CBD5E1' : c.metal;
  const metalDark = state === 'locked' ? '#94A3B8' : c.metalDark;
  const metalLight = state === 'locked' ? '#E2E8F0' : c.metalLight;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="59" rx="22" ry="3" fill="rgba(0,0,0,0.18)" />
      <rect
        x="6"
        y="28"
        width="52"
        height="28"
        rx="3"
        fill={wood}
        stroke={woodDark}
        strokeWidth="2.5"
      />
      <path
        d="M6 38 L58 38 M6 48 L58 48"
        stroke={woodDark}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {[
        [6, 28],
        [52, 28],
        [6, 50],
        [52, 50],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="6"
          height="6"
          fill={metal}
          stroke={metalDark}
          strokeWidth="1.2"
        />
      ))}
      {state === 'open' ? (
        <g>
          <path
            d="M6 30 Q6 16 32 16 Q58 16 58 30 L58 32 L52 32 L52 22 Q42 18 32 18 Q22 18 12 22 L12 32 L6 32 Z"
            fill={wood}
            stroke={woodDark}
            strokeWidth="2.5"
            strokeLinejoin="round"
            transform="rotate(-22 8 30)"
          />
          <path
            d="M12 30 Q32 12 52 30"
            stroke={metalLight}
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        </g>
      ) : (
        <path
          d="M6 30 Q6 16 32 16 Q58 16 58 30 L58 32 L6 32 Z"
          fill={wood}
          stroke={woodDark}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      )}
      {state !== 'open' && (
        <g>
          <rect
            x="6"
            y="30"
            width="52"
            height="6"
            fill={metal}
            stroke={metalDark}
            strokeWidth="1.5"
          />
          <rect
            x="6"
            y="30"
            width="52"
            height="2"
            fill={metalLight}
            opacity="0.7"
          />
        </g>
      )}
      {state === 'locked' && (
        <g>
          <rect
            x="26"
            y="34"
            width="12"
            height="12"
            rx="2"
            fill={metalDark}
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          <path
            d="M29 34 V31 a3 3 0 0 1 6 0 V34"
            stroke="#1E293B"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="32" cy="40" r="1.6" fill="#1E293B" />
        </g>
      )}
      {state === 'unlocked' && (
        <g>
          <rect
            x="26"
            y="34"
            width="12"
            height="12"
            rx="2"
            fill={metalLight}
            stroke={metalDark}
            strokeWidth="1.5"
          />
          <circle cx="32" cy="38.5" r="1.8" fill={metalDark} />
          <path
            d="M32 38.5 V43"
            stroke={metalDark}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle
            cx="32"
            cy="22"
            r="2.5"
            fill={c.gem}
            stroke={metalDark}
            strokeWidth="1"
          />
        </g>
      )}
      {state === 'open' && (
        <g>
          <circle
            cx="22"
            cy="34"
            r="3.5"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          <circle
            cx="32"
            cy="32"
            r="4"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          <circle
            cx="42"
            cy="34"
            r="3.5"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          <circle
            cx="27"
            cy="30"
            r="2.5"
            fill={c.gem}
            stroke={metalDark}
            strokeWidth="1"
          />
          <circle
            cx="38"
            cy="30"
            r="2"
            fill="#22D3EE"
            stroke={metalDark}
            strokeWidth="1"
          />
        </g>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SoftCard — white card with soft shadow + thick rounded corners
// ─────────────────────────────────────────────────────────────
interface SoftCardProps extends HTMLAttributes<HTMLDivElement> {
  tinted?: boolean;
  padding?: number;
  children?: ReactNode;
}

export function SoftCard({
  children,
  style = {},
  tinted = false,
  padding = 18,
  ...rest
}: SoftCardProps) {
  const { tokens } = useTheme();
  return (
    <div
      {...rest}
      style={{
        background: tinted
          ? tokens.tokens.color.cardTint
          : tokens.tokens.color.cardBg,
        borderRadius: 24,
        padding,
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 0 rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BigNumber — hero numeral on the teach screen
// ─────────────────────────────────────────────────────────────
export function BigNumber({
  value,
  size = 220,
}: {
  value: number | string;
  size?: number;
}) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        fontFamily: tokens.tokens.font.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color: tokens.tokens.color.accent,
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
        textShadow: `0 6px 0 ${tokens.tokens.color.accentSoft}, 0 12px 24px rgba(0,0,0,0.10)`,
        letterSpacing: '-0.03em',
      }}
    >
      {value}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PulsingRing — sits around the "current" level node
// ─────────────────────────────────────────────────────────────
export function PulsingRing({ color }: { color?: string }) {
  const { tokens } = useTheme();
  return (
    <span
      style={{
        position: 'absolute',
        inset: -6,
        borderRadius: 999,
        border: `4px solid ${color ?? tokens.tokens.color.accent}`,
        animation: 'm4k-pulse 1.8s ease-out infinite',
        pointerEvents: 'none',
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// LevelNode — circle button used in the map grid
// ─────────────────────────────────────────────────────────────
export type LevelNodeState = 'locked' | 'available' | 'current' | 'done';

interface LevelNodeProps {
  n: number;
  state?: LevelNodeState;
  stars?: 0 | 1 | 2 | 3;
  onSelect?: () => void;
  ariaLabel?: string;
}

export function LevelNode({
  n,
  state = 'available',
  stars = 0,
  onSelect,
  ariaLabel,
}: LevelNodeProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  const size = 78;
  const cores: Record<
    LevelNodeState,
    { bg: string; fg: string; shadow: string }
  > = {
    locked: { bg: '#CBD5E1', fg: '#64748B', shadow: '#94A3B8' },
    available: { bg: c.accent, fg: '#fff', shadow: c.accentDark },
    current: { bg: c.accent, fg: '#fff', shadow: c.accentDark },
    done: { bg: c.success, fg: '#fff', shadow: '#15803D' },
  };
  const core = cores[state];
  const disabled = state === 'locked';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        position: 'relative',
      }}
    >
      <button
        type="button"
        onClick={disabled ? undefined : onSelect}
        disabled={disabled}
        aria-label={
          ariaLabel ??
          `Level ${n} — ${state}, ${stars} of 3 stars`
        }
        style={{
          appearance: 'none',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          width: size,
          height: size,
          borderRadius: '50%',
          background: core.bg,
          color: core.fg,
          boxShadow: `inset 0 -7px 0 ${core.shadow}, 0 4px 0 rgba(0,0,0,0.08), 0 8px 14px rgba(0,0,0,0.10)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.tokens.font.display,
          fontWeight: 900,
          fontSize: 30,
          position: 'relative',
          padding: 0,
        }}
      >
        {state === 'current' && <PulsingRing />}
        {state === 'locked' && (
          <IconLock size={42} color="#fff" stroke="#475569" />
        )}
        {state === 'done' && (
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12 L10 17 L19 7"
              stroke="#fff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {(state === 'available' || state === 'current') && (
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</span>
        )}
      </button>
      {state === 'done' && <StarRow filled={stars} size={14} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkle decoration
// ─────────────────────────────────────────────────────────────
export function Sparkle({
  size = 16,
  color = '#FACC15',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 1 L12 8 L19 10 L12 12 L10 19 L8 12 L1 10 L8 8 Z"
        fill={color}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SpeakButton — round 🔊 button for replay narration
// ─────────────────────────────────────────────────────────────
interface SpeakButtonProps {
  label?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function SpeakButton({ label, onClick, ariaLabel }: SpeakButtonProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label ?? 'Dinle'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: '#fff',
        border: 'none',
        borderRadius: 999,
        padding: label ? '10px 22px 10px 8px' : '8px',
        cursor: 'pointer',
        boxShadow: `inset 0 -4px 0 ${c.accentSoft}, 0 4px 0 rgba(0,0,0,0.05), 0 6px 14px rgba(0,0,0,0.08)`,
        fontFamily: tokens.tokens.font.display,
        fontWeight: 800,
        fontSize: 18,
        color: c.accentDark,
      }}
    >
      <IconSound size={42} color={c.accent} stroke={c.accentDark} />
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// PageBg — themed gradient + decorative blobs
// ─────────────────────────────────────────────────────────────
interface PageBgProps {
  deep?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export function PageBg({ deep = false, children, style = {} }: PageBgProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100dvh',
        background: deep ? c.bgDeep : c.bgGrad,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: c.accent,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -50,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: c.accent,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', minHeight: '100dvh' }}>{children}</div>
    </div>
  );
}
