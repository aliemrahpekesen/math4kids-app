import { useTranslation } from 'react-i18next';
import { Card, NumeralTile, StarRow, TouchTarget } from '../ui';
import type { Exercise } from '../engines/types';

interface ExerciseRunnerProps {
  exercise: Exercise;
  onAnswer: (correct: boolean, picked: string) => void;
  hintsUsed?: number;
}

/** Render a generic exercise. Handles all 13 exercise types via switch. */
export function ExerciseRunner({
  exercise,
  onAnswer,
  hintsUsed = 0,
}: ExerciseRunnerProps) {
  const { t } = useTranslation('lesson');

  const promptVars: Record<string, unknown> = exercise.meta ?? {};
  const promptText = t(exercise.prompt, promptVars);

  const checkAndFire = (picked: string) => {
    const correct = picked === exercise.correctAnswer;
    onAnswer(correct, picked);
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <h2 className="font-display text-xl text-fg/90 mb-4">{promptText}</h2>
        <ExerciseVisual exercise={exercise} />
        <div className="grid grid-cols-2 gap-3 mt-6">
          {exercise.options.map((opt) => {
            const asNumber = Number(opt);
            if (Number.isFinite(asNumber) && /^\d+$/.test(opt)) {
              return (
                <NumeralTile
                  key={opt}
                  value={asNumber}
                  onSelect={() => checkAndFire(opt)}
                />
              );
            }
            return (
              <TouchTarget
                key={opt}
                onClick={() => checkAndFire(opt)}
                className="bg-surface text-fg hover:bg-primary hover:text-primary-fg rounded-soft"
              >
                {opt}
              </TouchTarget>
            );
          })}
        </div>
        {hintsUsed > 0 && (
          <div className="mt-4 text-fg/60 text-sm">
            <StarRow stars={3} size="sm" /> {t('hint')} × {hintsUsed}
          </div>
        )}
      </Card>
    </main>
  );
}

/**
 * Visual payload renderer. Each exercise.meta drives a different visual.
 * Kept inline to avoid file proliferation; can be split per-type later.
 */
function ExerciseVisual({ exercise }: { exercise: Exercise }) {
  const meta: Record<string, unknown> = exercise.meta ?? {};
  switch (exercise.type) {
    case 'count-objects': {
      const count = (meta.count as number) ?? 0;
      const glyph = (meta.glyph as string) ?? '⭐';
      return (
        <div className="flex flex-wrap justify-center gap-2 text-4xl py-4">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} aria-hidden="true">
              {glyph}
            </span>
          ))}
        </div>
      );
    }
    case 'add-visual': {
      const a = (meta.a as number) ?? 0;
      const b = (meta.b as number) ?? 0;
      return (
        <div className="flex items-center justify-center gap-3 text-3xl py-4 flex-wrap">
          <span>{'🟣'.repeat(a)}</span>
          <span className="font-display">+</span>
          <span>{'🟢'.repeat(b)}</span>
        </div>
      );
    }
    case 'subtract-visual': {
      const a = (meta.a as number) ?? 0;
      const b = (meta.b as number) ?? 0;
      return (
        <div className="text-3xl py-4">
          <span className="line-through opacity-50">{'🟠'.repeat(b)}</span>
          <span>{'🟠'.repeat(a - b)}</span>
        </div>
      );
    }
    case 'groups-of': {
      const groups = (meta.groups as number) ?? 0;
      const each = (meta.each as number) ?? 0;
      return (
        <div className="flex flex-col items-center gap-2 py-4">
          {Array.from({ length: groups }, (_, gi) => (
            <div key={gi} className="flex gap-1">
              {Array.from({ length: each }, (_, ei) => (
                <span key={ei} aria-hidden="true" className="text-2xl">
                  ⭐
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    }
    case 'pattern-complete': {
      const seq: string[] = (meta.sequence as string[] | undefined) ?? [];
      return (
        <div className="flex items-center justify-center gap-2 text-3xl py-4">
          {seq.map((tok, i) => (
            <span key={i} aria-hidden="true">
              {tok}
            </span>
          ))}
          <span className="bg-accent/30 rounded-soft px-3 py-1 font-display">
            ?
          </span>
        </div>
      );
    }
    case 'shape-tap': {
      // We don't have a real shape gallery yet; render the target name large.
      return null;
    }
    case 'share-equally': {
      const total = (meta.total as number) ?? 0;
      const groups = (meta.groups as number) ?? 1;
      return (
        <div className="py-4">
          <div className="text-3xl">{'🍪'.repeat(total)}</div>
          <div className="text-fg/60 text-sm mt-2">
            {groups} {groups === 1 ? 'friend' : 'friends'}
          </div>
        </div>
      );
    }
    case 'match-quantity': {
      const q = (meta.quantity as number) ?? 0;
      return (
        <div className="flex justify-center gap-1 text-3xl py-4">
          {Array.from({ length: q }, (_, i) => (
            <span key={i} aria-hidden="true">
              🔵
            </span>
          ))}
        </div>
      );
    }
    case 'count-tens': {
      const tens = (meta.tens as number) ?? 0;
      const ones = (meta.ones as number) ?? 0;
      return (
        <div className="py-4">
          <div className="text-fg/70 text-xs mb-1">Onluklar</div>
          <div className="flex flex-wrap justify-center gap-1 mb-3">
            {Array.from({ length: tens }, (_, i) => (
              <span key={i} className="text-2xl" aria-hidden="true">
                🟦
              </span>
            ))}
          </div>
          <div className="text-fg/70 text-xs mb-1">Birlikler</div>
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: ones }, (_, i) => (
              <span key={i} className="text-2xl" aria-hidden="true">
                🟨
              </span>
            ))}
          </div>
        </div>
      );
    }
    case 'place-value-2digit': {
      const n = (meta.n as number) ?? 0;
      return (
        <div className="py-4 text-center">
          <div className="font-display text-5xl text-primary-fg tabular-nums">
            {n}
          </div>
        </div>
      );
    }
    case 'place-value-3digit': {
      const n = (meta.n as number) ?? 0;
      return (
        <div className="py-4 text-center">
          <div className="font-display text-5xl text-primary-fg tabular-nums">
            {n}
          </div>
        </div>
      );
    }
    case 'skip-counting': {
      const display = (meta.display as string[] | undefined) ?? [];
      return (
        <div className="flex items-center justify-center gap-2 text-2xl py-4 flex-wrap tabular-nums">
          {display.map((tok, i) => (
            <span
              key={i}
              className={
                tok === '?'
                  ? 'bg-accent/30 rounded-soft px-3 py-1 font-display'
                  : 'font-display'
              }
            >
              {tok}
            </span>
          ))}
        </div>
      );
    }
    case 'tap-number-2digit':
    case 'tap-number-3digit': {
      const n = (meta.n as number) ?? 0;
      return (
        <div className="py-2 text-center text-fg/70 text-sm">
          ({n})
        </div>
      );
    }
    case 'add-numeric':
    case 'sub-numeric':
    case 'add-2digit-no-carry':
    case 'sub-2digit-no-regroup':
    case 'add-2digit-carry':
    case 'sub-2digit-regroup':
    case 'mult-small':
    case 'div-small':
    case 'mult-1d-by-2d':
    case 'div-with-remainder':
    case 'add-3digit':
    case 'sub-3digit': {
      const expr = (meta.expression as string) ?? '';
      return (
        <div className="py-4 font-display text-4xl text-primary-fg tabular-nums text-center">
          {expr} = ?
        </div>
      );
    }
    default:
      return null;
  }
}
