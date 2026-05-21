import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../themes/ThemeProvider';
import { PageBg, ChunkyButton } from '../ui';
import { setOnboardingDraft } from './OnboardingProfile';
import { THEME_KEYS, type ThemeKey } from '../themes/types';

interface ThemeCard {
  id: ThemeKey;
  name: string;
  desc: string;
  gradient: { from: string; mid: string; to: string };
  emoji: string;
  accent: string;
}

const THEME_CARDS: Record<ThemeKey, ThemeCard> = {
  space: {
    id: 'space',
    name: 'Uzay',
    desc: 'Roketler ve yıldızlar',
    gradient: { from: '#4C1D95', mid: '#1E1B4B', to: '#020617' },
    emoji: '🚀',
    accent: '#7C3AED',
  },
  jungle: {
    id: 'jungle',
    name: 'Orman',
    desc: 'Muzlar ve maymunlar',
    gradient: { from: '#FDE68A', mid: '#86EFAC', to: '#14532D' },
    emoji: '🍌',
    accent: '#16A34A',
  },
  ocean: {
    id: 'ocean',
    name: 'Okyanus',
    desc: 'Balıklar ve dalgalar',
    gradient: { from: '#7DD3FC', mid: '#0EA5E9', to: '#0C4A6E' },
    emoji: '🐟',
    accent: '#0EA5E9',
  },
  candy: {
    id: 'candy',
    name: 'Şekerler',
    desc: 'Tatlılar ve renkler',
    gradient: { from: '#FCE7F3', mid: '#F9A8D4', to: '#BE185D' },
    emoji: '🍬',
    accent: '#EC4899',
  },
};

function Stepper({ step }: { step: number }) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 18,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: i === step ? 22 : 8,
            height: 8,
            borderRadius: 999,
            background: i <= step ? tokens.tokens.color.accent : '#E5E7EB',
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingTheme() {
  const navigate = useNavigate();
  const { tokens, setTheme } = useTheme();
  const [selected, setSelected] = useState<ThemeKey>(tokens.key);

  const choose = (key: ThemeKey) => {
    setSelected(key);
    setTheme(key);
  };

  const submit = () => {
    setOnboardingDraft({});
    void navigate('/onboarding/parent-email');
  };

  return (
    <PageBg>
      <div
        style={{
          padding: '64px 24px 0',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stepper step={2} />
        <div
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 28,
            color: '#0F172A',
            textAlign: 'center',
          }}
        >
          Bir dünya seç
        </div>
        <div
          style={{
            fontFamily: tokens.tokens.font.body,
            fontWeight: 600,
            fontSize: 14,
            color: '#64748B',
            textAlign: 'center',
            marginBottom: 22,
          }}
        >
          Sonra istediğinde değiştirebilirsin.
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            flex: 1,
          }}
        >
          {THEME_KEYS.map((key) => {
            const card = THEME_CARDS[key];
            const sel = key === selected;
            return (
              <button
                key={key}
                type="button"
                onClick={() => choose(key)}
                aria-label={card.name}
                aria-pressed={sel}
                style={{
                  appearance: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: '#fff',
                  padding: 0,
                  border: 'none',
                  boxShadow: sel
                    ? `0 0 0 4px ${card.accent}, 0 8px 0 rgba(0,0,0,0.10), 0 12px 24px rgba(0,0,0,0.18)`
                    : '0 4px 0 rgba(0,0,0,0.06), 0 8px 18px rgba(0,0,0,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minHeight: 130,
                    background: `linear-gradient(180deg, ${card.gradient.from} 0%, ${card.gradient.mid} 50%, ${card.gradient.to} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 64,
                  }}
                  aria-hidden="true"
                >
                  {card.emoji}
                </div>
                <div
                  style={{
                    background: '#fff',
                    padding: '10px 12px 12px',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: tokens.tokens.font.display,
                      fontWeight: 800,
                      fontSize: 18,
                      color: '#0F172A',
                      lineHeight: 1.1,
                    }}
                  >
                    {card.name}
                  </div>
                  <div
                    style={{
                      fontFamily: tokens.tokens.font.body,
                      fontWeight: 600,
                      fontSize: 11,
                      color: '#64748B',
                      lineHeight: 1.2,
                      marginTop: 2,
                    }}
                  >
                    {card.desc}
                  </div>
                </div>
                {sel && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: '#22C55E',
                      border: '3px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 12 12">
                      <path
                        d="M2 6 L5 9 L10 3"
                        stroke="#fff"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '20px 0 30px' }}>
          <div style={{ flex: 1 }}>
            <ChunkyButton
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => void navigate('/onboarding/avatar')}
            >
              ← Geri
            </ChunkyButton>
          </div>
          <div style={{ flex: 2 }}>
            <ChunkyButton variant="primary" size="lg" fullWidth onClick={submit}>
              Devam et →
            </ChunkyButton>
          </div>
        </div>
      </div>
    </PageBg>
  );
}
