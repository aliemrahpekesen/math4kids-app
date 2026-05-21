/**
 * Place-value blocks + themed counting object + language flag SVGs.
 * Ported from design_files/avatars.jsx.
 */
import type { ReactNode } from 'react';

interface BlockProps {
  size?: number;
}

/** Hundreds block — 10×10 grid of unit cubes, used on hard-tier place value. */
export function HundredBlock({ size = 84 }: BlockProps) {
  const cells: ReactNode[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * 8 + 1}
          y={r * 8 + 1}
          width="7"
          height="7"
          rx="1"
          fill="#0EA5E9"
          stroke="#0369A1"
          strokeWidth="0.6"
        />
      );
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 82 82" aria-hidden="true">
      <rect width="82" height="82" rx="6" fill="#E0F2FE" />
      {cells}
    </svg>
  );
}

/** Tens block — 1×10 column of unit cubes. */
export function TenBlock({ size = 84 }: BlockProps) {
  return (
    <svg
      width={size / 10}
      height={size}
      viewBox="0 0 10 82"
      aria-hidden="true"
    >
      <rect width="10" height="82" rx="2" fill="#DCFCE7" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x="1"
          y={i * 8 + 1}
          width="8"
          height="7"
          rx="1"
          fill="#22C55E"
          stroke="#15803D"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

/** Ones block — single unit cube. */
export function OneBlock({ size = 14 }: BlockProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="2"
        fill="#FDE68A"
        stroke="#B45309"
        strokeWidth="0.8"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Themed object glyph — shown on teach screens for counting.
// ─────────────────────────────────────────────────────────────
type ObjectKey = 'rocket' | 'banana' | 'fish' | 'candy';

interface ObjectGlyphProps {
  kind: ObjectKey;
  size?: number;
}

export function ObjectGlyph({ kind, size = 32 }: ObjectGlyphProps) {
  switch (kind) {
    case 'rocket':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M16 4 Q22 4 22 16 L22 22 L10 22 L10 16 Q10 4 16 4 Z"
            fill="#F87171"
            stroke="#7F1D1D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="13" r="2.5" fill="#FFF" stroke="#7F1D1D" strokeWidth="1.5" />
          <path
            d="M10 18 L6 24 L10 23 Z M22 18 L26 24 L22 23 Z"
            fill="#FB923C"
            stroke="#7F1D1D"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M13 22 L13 27 L16 25 L19 27 L19 22"
            fill="#FACC15"
            stroke="#B45309"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M6 10 Q4 22 16 26 Q26 28 26 18 Q24 22 16 22 Q8 22 6 10 Z"
            fill="#FACC15"
            stroke="#854D0E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M6 10 L4 6 L8 10"
            stroke="#854D0E"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'fish':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <ellipse
            cx="14"
            cy="16"
            rx="10"
            ry="6"
            fill="#0EA5E9"
            stroke="#0369A1"
            strokeWidth="2"
          />
          <path
            d="M24 12 L30 8 L30 24 L24 20 Z"
            fill="#0EA5E9"
            stroke="#0369A1"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="14" r="1.6" fill="#fff" />
          <circle cx="10" cy="14" r="0.7" fill="#0F172A" />
        </svg>
      );
    case 'candy':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
          <ellipse
            cx="16"
            cy="16"
            rx="8"
            ry="6"
            fill="#EC4899"
            stroke="#831843"
            strokeWidth="2"
          />
          <path
            d="M8 16 L3 12 L4 20 Z"
            fill="#FBBF24"
            stroke="#831843"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M24 16 L29 12 L28 20 Z"
            fill="#FBBF24"
            stroke="#831843"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 14 Q16 12 20 14 M12 18 Q16 20 20 18"
            stroke="#fff"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      );
  }
}

// ─────────────────────────────────────────────────────────────
// Language flags (TR, EN, DE) — used on the language picker.
// ─────────────────────────────────────────────────────────────
type FlagKey = 'tr' | 'en' | 'de';

export function Flag({ kind, size = 64 }: { kind: FlagKey; size?: number }) {
  switch (kind) {
    case 'tr':
      return (
        <svg width={size} height={size * 0.66} viewBox="0 0 96 64" aria-hidden="true">
          <rect width="96" height="64" rx="8" fill="#E30A17" />
          <circle cx="36" cy="32" r="14" fill="#fff" />
          <circle cx="40" cy="32" r="11" fill="#E30A17" />
          <path
            d="M52 32 L58 30 L54 35 L60 36 L54 38 L58 43 L52 38 L46 42 L48 35 L42 32 L48 30 Z"
            fill="#fff"
          />
        </svg>
      );
    case 'en':
      return (
        <svg width={size} height={size * 0.66} viewBox="0 0 96 64" aria-hidden="true">
          <rect width="96" height="64" rx="8" fill="#012169" />
          <path d="M0 0 L96 64 M96 0 L0 64" stroke="#fff" strokeWidth="10" />
          <path d="M0 0 L96 64 M96 0 L0 64" stroke="#C8102E" strokeWidth="6" />
          <path d="M48 0 V64 M0 32 H96" stroke="#fff" strokeWidth="16" />
          <path d="M48 0 V64 M0 32 H96" stroke="#C8102E" strokeWidth="10" />
        </svg>
      );
    case 'de':
      return (
        <svg width={size} height={size * 0.66} viewBox="0 0 96 64" aria-hidden="true">
          <rect width="96" height="22" fill="#000" />
          <rect y="22" width="96" height="20" fill="#DD0000" />
          <rect y="42" width="96" height="22" fill="#FFCE00" />
          <rect width="96" height="64" rx="8" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </svg>
      );
  }
}
