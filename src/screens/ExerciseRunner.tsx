import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import {
  ObjectGlyph,
  HundredBlock,
  TenBlock,
  OneBlock,
} from '../ui';
import { IconSound } from '../ui/icons';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';
import type { Exercise } from '../engines/types';

type ObjectKind = 'rocket' | 'banana' | 'fish' | 'candy';
const THEME_OBJECT: Record<string, ObjectKind> = {
  rocket: 'rocket',
  banana: 'banana',
  fish: 'fish',
  candy: 'candy',
};

interface ExerciseRunnerProps {
  exercise: Exercise;
  onAnswer: (correct: boolean, picked: string) => void;
  hintsUsed?: number;
}

const SHAPE_GLYPH: Record<string, string> = {
  circle: '🔵',
  square: '🟦',
  triangle: '🔺',
  rectangle: '▬',
};

interface AnswerTileProps {
  value: string;
  state: 'idle' | 'correct' | 'wrong';
  big?: boolean;
  onSelect: () => void;
}

function AnswerTile({ value, state, big = false, onSelect }: AnswerTileProps) {
  const { tokens } = useTheme();
  const palettes = {
    idle: { bg: '#fff', fg: '#0F172A', border: 'transparent', shadow: '#E5E7EB' },
    correct: { bg: '#DCFCE7', fg: '#15803D', border: '#22C55E', shadow: '#16A34A' },
    wrong: { bg: '#FEE2E2', fg: '#991B1B', border: '#F87171', shadow: '#DC2626' },
  };
  const p = palettes[state];
  const glyph = SHAPE_GLYPH[value];
  const display = glyph ?? value;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={value}
      style={{
        appearance: 'none',
        cursor: 'pointer',
        background: p.bg,
        color: p.fg,
        border: `3px solid ${p.border}`,
        borderRadius: 22,
        padding: big ? '22px 14px' : '16px 10px',
        fontFamily: tokens.tokens.font.display,
        fontWeight: 900,
        fontSize: big ? 38 : 30,
        fontVariantNumeric: 'tabular-nums',
        boxShadow: `inset 0 -6px 0 ${p.shadow}, 0 4px 0 rgba(0,0,0,0.04), 0 8px 18px rgba(0,0,0,0.06)`,
        transition: 'transform .08s',
        minHeight: big ? 88 : 64,
      }}
    >
      {display}
    </button>
  );
}

interface ExerciseFrameProps {
  prompt: string;
  onSpeak: () => void;
  children: React.ReactNode;
  options: string[];
  onAnswer: (picked: string) => void;
  tilesLayout?: 'grid-2x2' | 'row-4';
  bigTiles?: boolean;
  hintsUsed?: number;
}

function ExerciseFrame({
  prompt,
  onSpeak,
  children,
  options,
  onAnswer,
  tilesLayout = 'grid-2x2',
  bigTiles = false,
  hintsUsed = 0,
}: ExerciseFrameProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  return (
    <div
      style={{
        padding: '64px 16px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: '100dvh',
      }}
    >
      {/* Prompt bar */}
      <button
        type="button"
        onClick={onSpeak}
        aria-label={prompt}
        style={{
          appearance: 'none',
          border: 'none',
          background: '#fff',
          borderRadius: 22,
          padding: '12px 16px 12px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textAlign: 'left',
          width: '100%',
          cursor: 'pointer',
          boxShadow:
            'inset 0 -4px 0 rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.06)',
        }}
      >
        <IconSound size={48} color={c.accent} stroke={c.accentDark} />
        <span
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 20,
            color: '#0F172A',
          }}
        >
          {prompt}
        </span>
      </button>

      {/* Hero visual */}
      <div
        style={{
          background: '#fff',
          borderRadius: 22,
          padding: 16,
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 0 rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)',
        }}
      >
        {children}
      </div>

      {/* Hints indicator */}
      {hintsUsed > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            fontSize: 24,
          }}
          aria-label={`hints: ${hintsUsed}`}
        >
          {'💡'.repeat(Math.min(hintsUsed, 5))}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Answer tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            tilesLayout === 'grid-2x2' ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {options.map((opt) => (
          <AnswerTile
            key={opt}
            value={opt}
            state="idle"
            big={bigTiles}
            onSelect={() => onAnswer(opt)}
          />
        ))}
      </div>
    </div>
  );
}

interface TenFrameProps {
  n: number;
}

function TenFrame({ n }: TenFrameProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  return (
    <div
      style={{
        background: '#0F172A',
        padding: 4,
        borderRadius: 12,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 4,
        maxWidth: 240,
        margin: '0 auto',
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1 / 1',
            background: '#fff',
            borderRadius: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {i < n && (
            <div
              style={{
                width: '75%',
                height: '75%',
                borderRadius: '50%',
                background: c.accent,
                boxShadow: `0 -3px 0 ${c.accentDark} inset`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ExerciseRunner({
  exercise,
  onAnswer,
  hintsUsed = 0,
}: ExerciseRunnerProps) {
  const { t } = useTranslation('lesson');
  const { tokens } = useTheme();
  const audio = useAudio();
  const language = useSettingsStore((s) => s.language);

  const promptVars: Record<string, unknown> = exercise.meta ?? {};
  const promptText = t(exercise.prompt, promptVars);

  useEffect(() => {
    audio.speak(promptText, language);
    return () => {
      audio.stopSpeaking();
    };
  }, [audio, language, promptText]);

  const checkAndFire = (picked: string) => {
    const correct = picked === exercise.correctAnswer;
    onAnswer(correct, picked);
  };

  const kind: ObjectKind =
    THEME_OBJECT[tokens.illustration.object] ?? 'rocket';
  const meta: Record<string, unknown> = exercise.meta ?? {};

  // Choose visual + tile layout per exercise type.
  let visual: React.ReactNode = null;
  let layout: 'grid-2x2' | 'row-4' = 'row-4';
  let big = false;

  switch (exercise.type) {
    case 'count-objects': {
      const count = (meta.count as number) ?? 0;
      visual = (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 10,
            justifyItems: 'center',
            maxWidth: 280,
            margin: '0 auto',
          }}
        >
          {Array.from({ length: count }, (_, i) => (
            <ObjectGlyph key={i} kind={kind} size={52} />
          ))}
        </div>
      );
      layout = 'grid-2x2';
      big = true;
      break;
    }
    case 'match-quantity':
    case 'tap-number': {
      const q = (meta.quantity as number) ?? (meta.n as number) ?? 0;
      visual = (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <TenFrame n={Math.min(q, 10)} />
          {q <= 10 && (
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {Array.from({ length: q }, (_, i) => (
                <ObjectGlyph key={i} kind={kind} size={36} />
              ))}
            </div>
          )}
        </div>
      );
      break;
    }
    case 'add-visual':
    case 'add-numeric': {
      const a =
        (meta.a as number) ?? (meta.left as number) ?? 0;
      const b = (meta.b as number) ?? (meta.right as number) ?? 0;
      visual = (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              background: tokens.tokens.color.accentSoft,
              borderRadius: 16,
              padding: 10,
              minWidth: 100,
              minHeight: 100,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: a }, (_, i) => (
              <ObjectGlyph key={i} kind={kind} size={30} />
            ))}
          </div>
          <div
            style={{
              fontSize: 38,
              color: tokens.tokens.color.accent,
              fontWeight: 900,
            }}
            aria-hidden="true"
          >
            +
          </div>
          <div
            style={{
              background: '#FEF3C7',
              borderRadius: 16,
              padding: 10,
              minWidth: 100,
              minHeight: 100,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: b }, (_, i) => (
              <ObjectGlyph key={i} kind={kind} size={30} />
            ))}
          </div>
        </div>
      );
      break;
    }
    case 'subtract-visual':
    case 'sub-numeric': {
      const a = (meta.a as number) ?? 0;
      const b = (meta.b as number) ?? 0;
      visual = (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: a }, (_, i) => (
            <div
              key={i}
              style={{
                opacity: i < b ? 0.3 : 1,
                textDecoration: i < b ? 'line-through' : 'none',
              }}
            >
              <ObjectGlyph kind={kind} size={36} />
            </div>
          ))}
        </div>
      );
      break;
    }
    case 'place-value-2digit':
    case 'place-value-3digit': {
      const n = (meta.n as number) ?? 0;
      const h = Math.floor(n / 100);
      const tens = Math.floor((n % 100) / 10);
      const ones = n % 10;
      visual = (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          {h > 0 && (
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {Array.from({ length: h }, (_, i) => (
                <HundredBlock key={i} size={70} />
              ))}
            </div>
          )}
          {tens > 0 && (
            <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
              {Array.from({ length: tens }, (_, i) => (
                <TenBlock key={i} size={70} />
              ))}
            </div>
          )}
          {ones > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 3,
                maxWidth: 56,
              }}
            >
              {Array.from({ length: ones }, (_, i) => (
                <OneBlock key={i} size={14} />
              ))}
            </div>
          )}
        </div>
      );
      layout = 'grid-2x2';
      break;
    }
    case 'compare':
    case 'compare-2digit':
    case 'compare-3digit': {
      const a = (meta.a as number) ?? 0;
      const b = (meta.b as number) ?? 0;
      const compareCardStyle: React.CSSProperties = {
        background: '#fff',
        borderRadius: 22,
        padding: '14px 10px',
        border: `2px solid ${tokens.tokens.color.accent}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        minWidth: 100,
        boxShadow:
          'inset 0 -4px 0 rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.06)',
      };
      const compareValueStyle: React.CSSProperties = {
        fontFamily: tokens.tokens.font.display,
        fontWeight: 900,
        fontSize: 60,
        color: tokens.tokens.color.accentDark,
        fontVariantNumeric: 'tabular-nums',
      };
      visual = (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={compareCardStyle}>
            <span style={compareValueStyle}>{a}</span>
          </div>
          <span
            style={{
              fontFamily: tokens.tokens.font.display,
              fontSize: 32,
              color: '#CBD5E1',
              fontWeight: 900,
            }}
            aria-hidden="true"
          >
            VS
          </span>
          <div style={compareCardStyle}>
            <span style={compareValueStyle}>{b}</span>
          </div>
        </div>
      );
      layout = 'row-4';
      break;
    }
    case 'pattern-complete': {
      const seq: string[] =
        (meta.sequence as string[] | undefined) ?? [];
      visual = (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 36,
          }}
        >
          {seq.map((tok, i) => (
            <span key={i} aria-hidden="true">
              {tok}
            </span>
          ))}
          <span
            style={{
              background: tokens.tokens.color.accentSoft,
              color: tokens.tokens.color.accentDark,
              borderRadius: 12,
              padding: '4px 14px',
              fontFamily: tokens.tokens.font.display,
              fontWeight: 900,
            }}
          >
            ?
          </span>
        </div>
      );
      break;
    }
    case 'shape-tap': {
      const target = (meta.shape as string) ?? 'circle';
      visual = (
        <div style={{ fontSize: 80 }} aria-hidden="true">
          {SHAPE_GLYPH[target] ?? '⬛'}
        </div>
      );
      break;
    }
    case 'groups-of': {
      const groups = (meta.groups as number) ?? 0;
      const each = (meta.each as number) ?? 0;
      visual = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Array.from({ length: groups }, (_, gi) => (
            <div
              key={gi}
              style={{ display: 'flex', gap: 4, justifyContent: 'center' }}
            >
              {Array.from({ length: each }, (_, ei) => (
                <ObjectGlyph key={ei} kind={kind} size={26} />
              ))}
            </div>
          ))}
        </div>
      );
      break;
    }
    case 'share-equally': {
      const total = (meta.total as number) ?? 0;
      const groups = (meta.groups as number) ?? 1;
      visual = (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              gap: 4,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {Array.from({ length: total }, (_, i) => (
              <ObjectGlyph key={i} kind="candy" size={28} />
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: '#64748B' }}>
            {groups} {groups === 1 ? 'kişi' : 'kişiye'}
          </div>
        </div>
      );
      break;
    }
    case 'skip-counting': {
      const display = (meta.display as string[] | undefined) ?? [];
      visual = (
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {display.map((tok, i) => (
            <span
              key={i}
              style={{
                fontFamily: tokens.tokens.font.display,
                fontWeight: 800,
                fontSize: 24,
                color:
                  tok === '?'
                    ? tokens.tokens.color.accentDark
                    : '#0F172A',
                background:
                  tok === '?' ? tokens.tokens.color.accentSoft : 'transparent',
                padding: tok === '?' ? '4px 14px' : '0',
                borderRadius: 12,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {tok}
            </span>
          ))}
        </div>
      );
      break;
    }
    default: {
      const expr = (meta.expression as string) ?? '';
      if (expr) {
        visual = (
          <div
            style={{
              fontFamily: tokens.tokens.font.display,
              fontWeight: 800,
              fontSize: 44,
              color: tokens.tokens.color.accentDark,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {expr} = ?
          </div>
        );
      }
    }
  }

  return (
    <ExerciseFrame
      prompt={promptText}
      onSpeak={() => audio.speak(promptText, language)}
      options={exercise.options}
      onAnswer={checkAndFire}
      tilesLayout={layout}
      bigTiles={big}
      hintsUsed={hintsUsed}
    >
      {visual}
    </ExerciseFrame>
  );
}
