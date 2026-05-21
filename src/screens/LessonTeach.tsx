import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import {
  PageBg,
  SoftCard,
  BigNumber,
  SpeakButton,
  ObjectGlyph,
  HundredBlock,
  TenBlock,
  OneBlock,
} from '../ui';
import { IconBack } from '../ui/icons';
import { getLevelById } from '../engines/curriculum';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';

type ObjectKind = 'rocket' | 'banana' | 'fish' | 'candy';

const THEME_OBJECT: Record<string, ObjectKind> = {
  rocket: 'rocket',
  banana: 'banana',
  fish: 'fish',
  candy: 'candy',
};

function numbersToTeach(min: number, max: number): number[] {
  if (max - min + 1 <= 6) {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
  const stops = [0, 0.2, 0.5, 0.75, 1];
  const span = max - min;
  const set = new Set<number>();
  for (const s of stops) set.add(Math.round(min + span * s));
  return Array.from(set).sort((a, b) => a - b);
}

const NUMBER_WORDS_TR: Record<number, string> = {
  0: 'sıfır',
  1: 'bir',
  2: 'iki',
  3: 'üç',
  4: 'dört',
  5: 'beş',
  6: 'altı',
  7: 'yedi',
  8: 'sekiz',
  9: 'dokuz',
  10: 'on',
};
const NUMBER_WORDS_EN: Record<number, string> = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
};
const NUMBER_WORDS_DE: Record<number, string> = {
  0: 'null',
  1: 'eins',
  2: 'zwei',
  3: 'drei',
  4: 'vier',
  5: 'fünf',
  6: 'sechs',
  7: 'sieben',
  8: 'acht',
  9: 'neun',
  10: 'zehn',
};

function numberWord(n: number, locale: 'tr' | 'en' | 'de'): string {
  const map =
    locale === 'tr'
      ? NUMBER_WORDS_TR
      : locale === 'de'
        ? NUMBER_WORDS_DE
        : NUMBER_WORDS_EN;
  return map[n] ?? String(n);
}

function RepLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

interface TopBarProps {
  onBack: () => void;
  total: number;
  current: number;
  badge?: { label: string; bg: string; fg: string };
}

function TopBar({ onBack, total, current, badge }: TopBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 6px',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Geri"
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <IconBack size={44} />
      </button>
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? 24 : 10,
              height: 10,
              borderRadius: 999,
              background:
                i <= current ? 'var(--color-accent)' : '#E5E7EB',
              transition: 'width 0.2s',
            }}
          />
        ))}
      </div>
      {badge ? (
        <div
          style={{
            background: badge.bg,
            color: badge.fg,
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.04em',
          }}
        >
          {badge.label}
        </div>
      ) : (
        <div style={{ width: 44 }} />
      )}
    </div>
  );
}

interface RepObjectsProps {
  n: number;
  kind: ObjectKind;
}

function RepObjects({ n, kind }: RepObjectsProps) {
  if (n > 40) return null;
  return (
    <SoftCard padding={12}>
      <RepLabel>Objeler</RepLabel>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: n }, (_, i) => (
          <ObjectGlyph key={i} kind={kind} size={42} />
        ))}
      </div>
    </SoftCard>
  );
}

function RepTenFrame({ n }: { n: number }) {
  const { tokens } = useTheme();
  if (n > 10) return null;
  const accent = tokens.tokens.color.accent;
  const accentDark = tokens.tokens.color.accentDark;
  return (
    <SoftCard padding={12}>
      <RepLabel>Onluk çerçeve</RepLabel>
      <div
        style={{
          background: '#0F172A',
          padding: 4,
          borderRadius: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 4,
          maxWidth: 220,
          margin: '0 auto',
        }}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const filled = i < n;
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1 / 1',
                background: '#fff',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {filled && (
                <div
                  style={{
                    width: '78%',
                    height: '78%',
                    borderRadius: '50%',
                    background: accent,
                    boxShadow: `0 -3px 0 ${accentDark} inset`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </SoftCard>
  );
}

function RepFingers({ n }: { n: number }) {
  if (n > 10) return null;
  // Simplified hand: 5 fingers + thumb as oval pads. Highlighted = raised.
  const cells: readonly { key: string; idx: number }[] = [
    { key: 'thumb', idx: 0 },
    { key: 'index', idx: 1 },
    { key: 'middle', idx: 2 },
    { key: 'ring', idx: 3 },
    { key: 'pinky', idx: 4 },
  ];
  const leftHand = Math.min(5, n);
  const rightHand = Math.max(0, n - 5);
  return (
    <SoftCard padding={12}>
      <RepLabel>Parmaklar</RepLabel>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          padding: '6px 0',
        }}
      >
        {[
          { count: leftHand, label: 'Sol' },
          { count: rightHand, label: 'Sağ' },
        ].map((hand, hi) =>
          hand.count > 0 ? (
            <div
              key={hi}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'flex-end',
                }}
              >
                {cells.map((cell) => {
                  const raised = cell.idx < hand.count;
                  return (
                    <div
                      key={cell.key}
                      style={{
                        width: 14,
                        height: cell.key === 'thumb' ? 22 : raised ? 32 : 18,
                        borderRadius: 8,
                        background: raised ? '#FED7AA' : '#E5E7EB',
                        border: `2px solid ${raised ? '#FB923C' : '#CBD5E1'}`,
                      }}
                    />
                  );
                })}
              </div>
              <div
                style={{
                  width: 80,
                  height: 24,
                  background: '#FED7AA',
                  border: '2px solid #FB923C',
                  borderRadius: '50% 50% 8px 8px',
                }}
              />
            </div>
          ) : null
        )}
      </div>
    </SoftCard>
  );
}

function RepPlaceValueTwo({ n }: { n: number }) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    <SoftCard padding={14}>
      <RepLabel>Onluklar ve Birlikler</RepLabel>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 30,
              color: '#1E40AF',
            }}
          >
            {tens}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'flex-end',
            }}
          >
            {Array.from({ length: tens }, (_, i) => (
              <TenBlock key={i} size={84} />
            ))}
          </div>
          <div
            style={{
              background: '#DBEAFE',
              color: '#1E40AF',
              padding: '2px 10px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            onluk
          </div>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 32,
            color: '#94A3B8',
            marginBottom: 30,
          }}
        >
          +
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 30,
              color: '#B45309',
            }}
          >
            {ones}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 3,
              maxWidth: 80,
            }}
          >
            {Array.from({ length: ones }, (_, i) => (
              <OneBlock key={i} size={12} />
            ))}
          </div>
          <div
            style={{
              background: '#FEF3C7',
              color: '#B45309',
              padding: '2px 10px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            birlik
          </div>
        </div>
      </div>
    </SoftCard>
  );
}

function RepEquationTwo({ n }: { n: number }) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const { tokens } = useTheme();
  return (
    <SoftCard padding={14}>
      <div
        style={{
          fontFamily: tokens.tokens.font.display,
          fontWeight: 800,
          fontSize: 24,
          color: '#0F172A',
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ color: '#1E40AF' }}>{tens * 10}</span>
        <span style={{ color: '#94A3B8' }}> + </span>
        <span style={{ color: '#B45309' }}>{ones}</span>
        <span style={{ color: '#94A3B8' }}> = </span>
        <span style={{ color: tokens.tokens.color.accent }}>{n}</span>
      </div>
    </SoftCard>
  );
}

function RepPlaceValueThree({ n }: { n: number }) {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  return (
    <SoftCard padding={12}>
      <RepLabel>Yüzlükler · Onluklar · Birlikler</RepLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          alignItems: 'end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: '#DC2626' }}>{h}</div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: h }, (_, i) => (
              <HundredBlock key={i} size={56} />
            ))}
          </div>
          <div
            style={{
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            yüzlük
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: '#1E40AF' }}>{t}</div>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
            {Array.from({ length: t }, (_, i) => (
              <TenBlock key={i} size={70} />
            ))}
          </div>
          <div
            style={{
              background: '#DBEAFE',
              color: '#1E40AF',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            onluk
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: '#B45309' }}>{o}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3,
              maxWidth: 56,
            }}
          >
            {Array.from({ length: o }, (_, i) => (
              <OneBlock key={i} size={14} />
            ))}
          </div>
          <div
            style={{
              background: '#FEF3C7',
              color: '#B45309',
              padding: '2px 8px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            birlik
          </div>
        </div>
      </div>
    </SoftCard>
  );
}

function RepEquationThree({ n }: { n: number }) {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  const { tokens } = useTheme();
  return (
    <SoftCard padding={12}>
      <div
        style={{
          fontFamily: tokens.tokens.font.display,
          fontWeight: 800,
          fontSize: 22,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ color: '#DC2626' }}>{h * 100}</span>
        <span style={{ color: '#94A3B8' }}> + </span>
        <span style={{ color: '#1E40AF' }}>{t * 10}</span>
        <span style={{ color: '#94A3B8' }}> + </span>
        <span style={{ color: '#B45309' }}>{o}</span>
        <span style={{ color: '#94A3B8' }}> = </span>
        <span style={{ color: tokens.tokens.color.accent }}>{n}</span>
      </div>
    </SoftCard>
  );
}

export function LessonTeach() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const { tokens } = useTheme();
  const audio = useAudio();
  const language = useSettingsStore((s) => s.language);
  const levelId = Number(id ?? 1);
  const level = getLevelById(levelId);

  const numbers = useMemo<number[]>(() => {
    if (!level?.range) return [];
    return numbersToTeach(level.range[0], level.range[1]);
  }, [level]);

  const [idx, setIdx] = useState(0);
  const current = numbers[idx];
  const isLast = idx >= numbers.length - 1;

  const kind: ObjectKind =
    THEME_OBJECT[tokens.illustration.object] ?? 'rocket';

  useEffect(() => {
    if (current === undefined) return;
    const phrase =
      current <= 10
        ? `${numberWord(current, language)}. ${current}.`
        : `${current}`;
    audio.speak(phrase, language);
    return () => audio.stopSpeaking();
  }, [current, audio, language]);

  if (!level || numbers.length === 0 || current === undefined) {
    return (
      <PageBg>
        <div style={{ padding: 24 }}>
          <button
            type="button"
            onClick={() => void navigate(`/lesson/${levelId}/practice`)}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: tokens.tokens.color.accent,
              color: '#fff',
              border: 'none',
              fontSize: 36,
              cursor: 'pointer',
              boxShadow: tokens.tokens.shadow.glow,
            }}
            aria-label={t('startPractice')}
          >
            ▶
          </button>
        </div>
      </PageBg>
    );
  }

  const tier = level.difficulty;
  const badge =
    tier === 'medium'
      ? { label: 'ORTA', bg: '#FEF3C7', fg: '#92400E' }
      : tier === 'hard'
        ? { label: 'ZOR', bg: '#FEE2E2', fg: '#991B1B' }
        : undefined;

  const goNext = () => {
    if (isLast) {
      void navigate(`/lesson/${levelId}/practice`);
    } else {
      setIdx((i) => i + 1);
    }
  };
  const goPrev = () => {
    if (idx > 0) setIdx((i) => i - 1);
  };

  const word = current <= 10 ? numberWord(current, language) : '';

  return (
    <PageBg>
      <div
        style={{
          padding: '64px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          gap: 12,
        }}
      >
        <TopBar
          onBack={() => void navigate(`/lesson/${levelId}`)}
          total={numbers.length}
          current={idx}
          badge={badge}
        />

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}
          >
            {tier === 'easy'
              ? 'Sayı'
              : tier === 'medium'
                ? 'İki Basamaklı'
                : 'Üç Basamaklı'}
          </div>
          <BigNumber
            value={current}
            size={tier === 'easy' ? 170 : tier === 'medium' ? 130 : 104}
          />
          {word && (
            <div
              style={{
                marginTop: 6,
                fontFamily: tokens.tokens.font.display,
                fontWeight: 800,
                fontSize: 30,
                color: '#0F172A',
              }}
            >
              {word}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tier === 'easy' && (
            <>
              <RepObjects n={current} kind={kind} />
              <RepTenFrame n={current} />
              <RepFingers n={current} />
            </>
          )}
          {tier === 'medium' && (
            <>
              <RepPlaceValueTwo n={current} />
              <RepEquationTwo n={current} />
            </>
          )}
          {tier === 'hard' && (
            <>
              <RepPlaceValueThree n={current} />
              <RepEquationThree n={current} />
            </>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <SpeakButton
            label="Dinle"
            onClick={() => audio.speak(`${word} ${current}`, language)}
          />
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '0 4px',
          }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={idx === 0}
            aria-label="Önceki"
            style={{
              minWidth: 88,
              minHeight: 52,
              border: 'none',
              borderRadius: 16,
              background: idx === 0 ? '#F1F5F9' : '#fff',
              color: idx === 0 ? '#CBD5E1' : tokens.tokens.color.accentDark,
              fontFamily: tokens.tokens.font.display,
              fontWeight: 800,
              fontSize: 16,
              boxShadow:
                idx === 0
                  ? 'none'
                  : 'inset 0 -4px 0 rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.08)',
              cursor: idx === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Önceki
          </button>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#64748B',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {idx + 1} / {numbers.length}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-label={isLast ? t('startPractice') : 'Sonraki'}
            style={{
              minWidth: 88,
              minHeight: 52,
              border: 'none',
              borderRadius: 16,
              background: tokens.tokens.color.accent,
              color: '#fff',
              fontFamily: tokens.tokens.font.display,
              fontWeight: 800,
              fontSize: 16,
              boxShadow: `inset 0 -5px 0 ${tokens.tokens.color.accentDark}, 0 4px 10px rgba(0,0,0,0.12)`,
              cursor: 'pointer',
            }}
          >
            {isLast ? '✓ Bitir' : 'Sonraki →'}
          </button>
        </div>
      </div>
    </PageBg>
  );
}
