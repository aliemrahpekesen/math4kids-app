import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { getLevelById } from '../engines/curriculum';
import { useTheme } from '../themes/ThemeProvider';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';
import type { ThemeKey } from '../themes/types';

/**
 * Per-theme object glyph used to count THINGS. Picked to be cheerful,
 * non-scary, and matched to the theme aesthetic.
 */
const THEME_COUNT_GLYPH: Record<ThemeKey, string> = {
  space: '🚀',
  jungle: '🍌',
  ocean: '🐟',
  candy: '🍬',
};

/** Distinct color palette per representation (mapped to the theme accent). */
const REP_COLORS = ['text-primary', 'text-accent', 'text-success', 'text-warning'];

/**
 * What numbers does this level "teach"? For easy single-digit levels we
 * teach each integer in the level's range; for medium/hard tiers we
 * teach a handful of representative numbers from the range so the child
 * gets exposure without enduring 90 screens for 10–99.
 */
function numbersToTeach(min: number, max: number): number[] {
  if (max - min + 1 <= 6) {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
  // Sample 5 representative numbers across the span.
  const stops = [0, 0.2, 0.5, 0.75, 1];
  const span = max - min;
  const set = new Set<number>();
  for (const s of stops) set.add(Math.round(min + span * s));
  return Array.from(set).sort((a, b) => a - b);
}

interface RepresentationProps {
  n: number;
  glyph: string;
}

function DotsRow({ n, glyph }: RepresentationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1 py-2">
      {Array.from({ length: Math.min(n, 20) }, (_, i) => (
        <span key={i} className="text-3xl" aria-hidden="true">
          {glyph}
        </span>
      ))}
      {n > 20 && (
        <span className="text-fg/60 self-center ml-2">… ({n})</span>
      )}
    </div>
  );
}

function FivesGrid({ n, glyph }: RepresentationProps) {
  if (n > 30) {
    // Show tens decomposition instead.
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return (
      <div className="py-2 text-center">
        <div className="text-fg/60 text-xs mb-1">Onluklar</div>
        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: tens }, (_, i) => (
            <span key={i} className="text-2xl" aria-hidden="true">
              🟦
            </span>
          ))}
        </div>
        <div className="text-fg/60 text-xs mb-1">Birlikler</div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: ones }, (_, i) => (
            <span key={i} className="text-2xl" aria-hidden="true">
              🟨
            </span>
          ))}
        </div>
      </div>
    );
  }
  const rows: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    rows.push(Math.min(5, remaining));
    remaining -= 5;
  }
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      {rows.map((rowCount, r) => (
        <div key={r} className="flex gap-1">
          {Array.from({ length: rowCount }, (_, i) => (
            <span key={i} className="text-2xl" aria-hidden="true">
              {glyph}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Fingers({ n }: RepresentationProps) {
  if (n === 0) {
    return (
      <div className="py-2 text-4xl text-center" aria-hidden="true">
        ✊
      </div>
    );
  }
  if (n > 10) return null;
  const left = Math.min(5, n);
  const right = Math.max(0, n - 5);
  const handFor = (count: number) => {
    if (count === 0) return '';
    if (count === 5) return '🖐️';
    return `+${count}`;
  };
  return (
    <div className="py-2 flex justify-center items-center gap-2 text-4xl" aria-hidden="true">
      {left === 5 ? '🖐️' : '✋'}
      <span className="text-fg/60 text-xl">{handFor(left)}</span>
      {right > 0 && (
        <>
          <span className="text-fg/60">+</span>
          <span className="text-fg/60 text-xl">{handFor(right)}</span>
        </>
      )}
    </div>
  );
}

function TenFrame({ n }: RepresentationProps) {
  const cells = Math.min(n, 10);
  return (
    <div className="grid grid-cols-5 gap-1 max-w-[200px] mx-auto py-2">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`w-9 h-9 rounded border-2 border-fg/30 flex items-center justify-center text-lg ${
            i < cells ? 'bg-accent text-accent-fg' : 'bg-bg/40'
          }`}
          aria-hidden="true"
        >
          {i < cells ? '●' : ''}
        </div>
      ))}
    </div>
  );
}

const NUMBER_WORD_TR: Record<number, string> = {
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
const NUMBER_WORD_EN: Record<number, string> = {
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
const NUMBER_WORD_DE: Record<number, string> = {
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
  const map = locale === 'tr' ? NUMBER_WORD_TR : locale === 'de' ? NUMBER_WORD_DE : NUMBER_WORD_EN;
  return map[n] ?? String(n);
}

export function LessonTeach() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const { t: tc } = useTranslation('common');
  const { key: themeKey } = useTheme();
  const audio = useAudio();
  const language = useSettingsStore((s) => s.language);
  const levelId = Number(id ?? 1);
  const level = getLevelById(levelId);

  const numbers = useMemo<number[]>(() => {
    if (!level?.range) return [];
    return numbersToTeach(level.range[0], level.range[1]);
  }, [level]);

  const [idx, setIdx] = useState(0);
  const glyph = THEME_COUNT_GLYPH[themeKey];
  const current = numbers[idx];
  const isLast = idx >= numbers.length - 1;

  // Speak the current number on entry / change.
  useEffect(() => {
    if (current === undefined) return;
    const phrase =
      current <= 10
        ? `${numberWord(current, language)}. ${current}.`
        : `${current}`;
    audio.speak(phrase, language);
    return () => audio.stopSpeaking();
  }, [current, audio, language]);

  if (!level) {
    return (
      <main className="app-shell">
        <p className="text-fg/70">{t('noLevelsForTier')}</p>
        <Button variant="primary" onClick={() => void navigate('/map')}>
          {t('backToMap')}
        </Button>
      </main>
    );
  }

  // If the level has no range (shapes/patterns/sorting/etc.), skip teach.
  if (numbers.length === 0 || current === undefined) {
    return (
      <main className="app-shell">
        <Card className="max-w-md w-full text-center">
          <h1 className="font-display text-2xl text-primary-fg mb-3">
            {t(`levelTitles.${levelId}`)}
          </h1>
          <p className="text-fg/80 mb-6">{t('teach.noNumbersHere')}</p>
          <Button
            variant="primary"
            onClick={() => void navigate(`/lesson/${levelId}/practice`)}
            className="w-full"
          >
            {t('startPractice')}
          </Button>
        </Card>
      </main>
    );
  }

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

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <Card className="w-full max-w-md text-center">
        <h1 className="font-display text-lg text-fg/80 mb-2">
          {t(`levelTitles.${levelId}`)}
        </h1>

        <button
          type="button"
          onClick={() =>
            audio.speak(numberWord(current, language) + ' ' + current, language)
          }
          className="block w-full mb-3 group"
          aria-label={`Replay narration: ${current}`}
        >
          <div className={`font-display text-7xl ${REP_COLORS[0]} tabular-nums`}>
            {current}
          </div>
          {current <= 10 && (
            <div className="font-display text-xl text-fg/70 mt-1">
              {numberWord(current, language)}
            </div>
          )}
          <div className="text-fg/40 text-xs mt-1">🔊 {t('teach.tapToHear')}</div>
        </button>

        <div className="space-y-3 mb-4 border-t border-fg/10 pt-3">
          <DotsRow n={current} glyph={glyph} />
          <FivesGrid n={current} glyph={glyph} />
          {current <= 10 && <TenFrame n={current} glyph={glyph} />}
          {current <= 10 && <Fingers n={current} glyph={glyph} />}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={idx === 0}
            className="min-w-[60px]"
            aria-label={tc('back')}
          >
            ←
          </Button>
          <span className="text-fg/60 text-sm">
            {idx + 1} / {numbers.length}
          </span>
          <Button
            variant="primary"
            onClick={goNext}
            className="min-w-[140px]"
          >
            {isLast ? t('startPractice') : tc('next') + ' →'}
          </Button>
        </div>
      </Card>
    </main>
  );
}
