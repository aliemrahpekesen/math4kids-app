import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../themes/ThemeProvider';
import { PageBg, ChunkyButton, Flag } from '../ui';
import { setLocale } from '../i18n/setup';
import { useSettingsStore } from '../state/settingsStore';
import type { Language } from '../state/types';

interface LangRow {
  code: Language;
  label: string;
  sub: string;
}

const ROWS: LangRow[] = [
  { code: 'tr', label: 'Türkçe', sub: 'Türkiye' },
  { code: 'en', label: 'English', sub: 'United Kingdom' },
  { code: 'de', label: 'Deutsch', sub: 'Deutschland' },
];

function Stepper({ step }: { step: number }) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        margin: '22px 0 24px',
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
            transition: 'width 0.2s',
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingLanguage() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const language = useSettingsStore((s) => s.language);
  const [selected, setSelected] = useState<Language>(language);

  const c = tokens.tokens.color;

  const onContinue = () => {
    void (async () => {
      await setLocale(selected);
      setLanguage(selected);
      await navigate('/onboarding/profile');
    })();
  };

  return (
    <PageBg>
      <div
        style={{
          padding: '74px 28px 0',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div
            style={{
              fontFamily: tokens.tokens.font.display,
              fontWeight: 900,
              fontSize: 36,
              color: c.accentDark,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Math<span style={{ color: c.accent }}>4</span>Kids
          </div>
          <div
            style={{
              fontFamily: tokens.tokens.font.body,
              fontWeight: 600,
              fontSize: 14,
              color: '#64748B',
              marginTop: 6,
            }}
          >
            Sayılarla oynamak için hazır mısın?
          </div>
        </div>

        <Stepper step={0} />

        <div
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 28,
            color: '#0F172A',
            textAlign: 'center',
            marginBottom: 22,
          }}
        >
          Dilini seç
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ROWS.map((row) => {
            const active = row.code === selected;
            return (
              <button
                key={row.code}
                type="button"
                onClick={() => setSelected(row.code)}
                aria-label={row.label}
                style={{
                  background: '#fff',
                  border: `3px solid ${active ? c.accent : 'transparent'}`,
                  borderRadius: 22,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: active
                    ? `inset 0 -5px 0 ${c.accentSoft}, 0 4px 0 rgba(0,0,0,0.05), 0 8px 18px rgba(0,0,0,0.08)`
                    : '0 2px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  }}
                >
                  <Flag kind={row.code} size={56} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: tokens.tokens.font.display,
                      fontWeight: 800,
                      fontSize: 22,
                      color: '#0F172A',
                      lineHeight: 1.1,
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontFamily: tokens.tokens.font.body,
                      fontWeight: 600,
                      fontSize: 13,
                      color: '#64748B',
                    }}
                  >
                    {row.sub}
                  </div>
                </div>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: active ? c.accent : '#fff',
                    border: `2.5px solid ${active ? c.accent : '#CBD5E1'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {active && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8 L7 12 L13 4"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '0 0 38px' }}>
          <ChunkyButton
            variant="primary"
            size="xl"
            fullWidth
            onClick={onContinue}
          >
            Devam et →
          </ChunkyButton>
        </div>
      </div>
    </PageBg>
  );
}
