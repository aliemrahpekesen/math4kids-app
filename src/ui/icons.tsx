/**
 * Math4Kids' own icon family — "chunky sticker" style.
 * Every icon is a filled shape with a thick navy stroke, a small white
 * "shine" highlight in the upper-left, and a soft drop shadow. Ported from
 * design_files/icons.jsx.
 *
 * Every icon takes { size, color, stroke }. Defaults follow the design.
 */
import type { ReactNode } from 'react';

const ICON_NAVY = '#0F172A';

interface IconWrapProps {
  size?: number;
  title: string;
  children: ReactNode;
}

function IconWrap({ size = 28, title, children }: IconWrapProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-label={title}
      role="img"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <g style={{ filter: 'drop-shadow(0 1px 0 rgba(15,23,42,0.15))' }}>
        {children}
      </g>
    </svg>
  );
}

function Shine({ d }: { d: string }) {
  return (
    <path
      d={d}
      stroke="rgba(255,255,255,0.65)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  );
}

interface IconProps {
  size?: number;
  color?: string;
  stroke?: string;
}

export function IconBack({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Geri">
      <rect
        x="3.5"
        y="6"
        width="25"
        height="20"
        rx="10"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        d="M19 11 L12 16 L19 21"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M22 13 L17 16 L22 19"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
      <Shine d="M6 9 Q7 8 9 8" />
    </IconWrap>
  );
}

export function IconClose({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Kapat">
      <circle
        cx="16"
        cy="16"
        r="12.5"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        d="M11 11 L21 21 M21 11 L11 21"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Shine d="M8 12 Q9 10 11 9" />
    </IconWrap>
  );
}

export function IconLock({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Kilitli">
      <path
        d="M10 14 V11 a6 6 0 0 1 12 0 V14"
        stroke={stroke}
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="13"
        width="20"
        height="15"
        rx="4.5"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <circle cx="16" cy="19" r="2.4" fill={stroke} />
      <path
        d="M16 19 L16 24"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Shine d="M9 16 Q9 15 11 15" />
    </IconWrap>
  );
}

export function IconSound({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Dinle">
      <path
        d="M5 13 V19 H10 L17 25 V7 L10 13 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 11 Q24 16 20 21"
        stroke={stroke}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M23 9 Q28 16 23 23"
        stroke={stroke}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <Shine d="M7 14 Q7 13 9 13" />
    </IconWrap>
  );
}

export function IconHeart({
  size = 28,
  color = '#EF4444',
  stroke = '#7F1D1D',
}: IconProps) {
  return (
    <IconWrap size={size} title="Can">
      <path
        d="M16 27 L5.5 16 Q2 12 5 8 Q8.5 3.5 13.5 7 L16 9 L18.5 7 Q23.5 3.5 27 8 Q30 12 26.5 16 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 11 Q13 11 13 16"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <Shine d="M7 12 Q7 10 9 9" />
    </IconWrap>
  );
}

export function IconCheck({
  size = 28,
  color = '#22C55E',
  stroke = '#15803D',
}: IconProps) {
  return (
    <IconWrap size={size} title="Doğru">
      <circle
        cx="16"
        cy="16"
        r="12.5"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        d="M9 16 L14 21 L23 11"
        stroke="#fff"
        strokeWidth="3.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Shine d="M8 12 Q9 10 11 9" />
    </IconWrap>
  );
}

export function IconSparkle({
  size = 28,
  color = '#FACC15',
  stroke = '#CA8A04',
}: IconProps) {
  return (
    <IconWrap size={size} title="Yıldız">
      <path
        d="M16 4 L19 13 L28 16 L19 19 L16 28 L13 19 L4 16 L13 13 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Shine d="M11 11 L13 13" />
    </IconWrap>
  );
}

export function IconProfile({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Profil">
      <circle
        cx="16"
        cy="11"
        r="6"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        d="M5 28 Q5 18 16 18 Q27 18 27 28"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Shine d="M11 8 Q11 6 13 6" />
    </IconWrap>
  );
}

export function IconSettings({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Ayarlar">
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        const x = 16 + Math.cos(a) * 10.5;
        const y = 16 + Math.sin(a) * 10.5;
        return (
          <rect
            key={i}
            x={x - 3}
            y={y - 3}
            width="6"
            height="6"
            rx="1.5"
            fill={color}
            stroke={stroke}
            strokeWidth="2"
            transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
          />
        );
      })}
      <circle
        cx="16"
        cy="16"
        r="7"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <circle cx="16" cy="16" r="2.5" fill={stroke} />
      <Shine d="M11 13 Q11 11 13 11" />
    </IconWrap>
  );
}

export function IconChart({
  size = 28,
  color = '#0EA5E9',
  stroke = '#0369A1',
}: IconProps) {
  return (
    <IconWrap size={size} title="İlerleme">
      <rect
        x="5"
        y="18"
        width="6"
        height="10"
        rx="2"
        fill={color}
        stroke={stroke}
        strokeWidth="2.2"
      />
      <rect
        x="13"
        y="13"
        width="6"
        height="15"
        rx="2"
        fill={color}
        stroke={stroke}
        strokeWidth="2.2"
      />
      <rect
        x="21"
        y="7"
        width="6"
        height="21"
        rx="2"
        fill={color}
        stroke={stroke}
        strokeWidth="2.2"
      />
      <path
        d="M22 5 L24 2 L26 5 Z"
        fill="#FACC15"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Shine d="M6 21 Q6 19 8 19" />
    </IconWrap>
  );
}

export function IconMail({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="E-posta">
      <rect
        x="4"
        y="9"
        width="24"
        height="17"
        rx="3"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        d="M4 11 L16 19 L28 11"
        stroke={stroke}
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect
        x="21"
        y="11.5"
        width="5"
        height="4"
        rx="0.8"
        fill="#EF4444"
        stroke={stroke}
        strokeWidth="1.2"
      />
      <Shine d="M7 13 Q7 11 9 11" />
    </IconWrap>
  );
}

export function IconPlay({
  size = 28,
  color = '#FFFFFF',
  stroke = ICON_NAVY,
}: IconProps) {
  return (
    <IconWrap size={size} title="Başla">
      <circle
        cx="16"
        cy="16"
        r="12.5"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
      />
      <path
        d="M13 10 L23 16 L13 22 Z"
        fill={stroke}
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <Shine d="M8 12 Q9 10 11 9" />
    </IconWrap>
  );
}

export function IconNumbers({
  size = 28,
  color = '#7C3AED',
  stroke = '#5B21B6',
}: IconProps) {
  return (
    <IconWrap size={size} title="Sayılar">
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="6"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        transform="rotate(-4 16 16)"
      />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="'Baloo 2', system-ui"
        fontWeight="900"
        fontSize="14"
        fill="#fff"
        transform="rotate(-4 16 16)"
      >
        123
      </text>
      <Shine d="M8 8 Q8 7 10 7" />
    </IconWrap>
  );
}

export function IconOperations({
  size = 28,
  color = '#F59E0B',
  stroke = '#B45309',
}: IconProps) {
  return (
    <IconWrap size={size} title="İşlemler">
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="6"
        fill={color}
        stroke={stroke}
        strokeWidth="2.5"
        transform="rotate(4 16 16)"
      />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="'Baloo 2', system-ui"
        fontWeight="900"
        fontSize="14"
        fill="#fff"
        transform="rotate(4 16 16)"
      >
        +−
      </text>
      <Shine d="M8 8 Q8 7 10 7" />
    </IconWrap>
  );
}
