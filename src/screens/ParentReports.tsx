import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';

type Cadence = 'daily' | 'weekly' | 'monthly' | 'yearly';

const CADENCES: Cadence[] = ['daily', 'weekly', 'monthly', 'yearly'];

export function ParentReports() {
  const { cadence: rawCadence = 'daily' } = useParams<{ cadence: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const cadence: Cadence = (CADENCES as string[]).includes(rawCadence)
    ? (rawCadence as Cadence)
    : 'daily';

  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const totalStars = Object.values(progress).reduce(
    (acc, p) => acc + (p?.bestStars ?? 0),
    0
  );
  const levelsCompleted = Object.values(progress).filter(
    (p) => (p?.bestStars ?? 0) === 3
  ).length;

  return (
    <main className="app-shell !justify-start !pt-6">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">
          {t('reports')}
        </h1>
        <Button
          variant="ghost"
          onClick={() => void navigate('/parent/dashboard')}
        >
          ←
        </Button>
      </div>

      <div className="w-full max-w-md grid grid-cols-4 gap-1 mb-4">
        {CADENCES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => void navigate(`/parent/reports/${c}`)}
            className={`px-2 py-2 rounded-soft font-display text-sm min-h-touch ${
              c === cadence ? 'bg-accent text-accent-fg' : 'bg-surface text-fg'
            }`}
            aria-pressed={c === cadence}
          >
            {t(
              c === 'daily'
                ? 'reportDaily'
                : c === 'weekly'
                  ? 'reportWeekly'
                  : c === 'monthly'
                    ? 'reportMonthly'
                    : 'reportYearly'
            )}
          </button>
        ))}
      </div>

      <Card className="w-full max-w-md">
        <h2 className="font-display text-lg text-primary-fg mb-3">
          {t(
            cadence === 'daily'
              ? 'reportDaily'
              : cadence === 'weekly'
                ? 'reportWeekly'
                : cadence === 'monthly'
                  ? 'reportMonthly'
                  : 'reportYearly'
          )}
        </h2>
        <div className="space-y-2 text-fg/90">
          <div className="flex justify-between">
            <span>{t('totalStars')}</span>
            <span className="font-display">⭐ {totalStars}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('progress')}</span>
            <span className="font-display">{levelsCompleted} / 17</span>
          </div>
          <div className="flex justify-between">
            <span>🪙</span>
            <span className="font-display">{coins}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-fg/10">
          <Button
            variant="ghost"
            disabled
            className="w-full opacity-60"
            aria-disabled
          >
            ✉ {t('sendReport')} — {t('sendReportComingSoon')}
          </Button>
        </div>
      </Card>
    </main>
  );
}
