import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, StarRow, CoinBadge } from '../ui';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { useSessionStore } from '../state/sessionStore';
import { getCurriculum } from '../engines/curriculum';

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}s ${m}d`;
  return `${m}d`;
}

export function ParentDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const levels = getCurriculum();
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );
  const revoke = useSessionStore((s) => s.revokeParentGate);

  const totalStars = Object.values(progress).reduce(
    (acc, p) => acc + (p?.bestStars ?? 0),
    0
  );
  const totalTimeMs = Object.values(progress).reduce(
    (acc, p) => acc + (p?.totalTimeMs ?? 0),
    0
  );
  const completedLevels = Object.values(progress).filter(
    (p) => (p?.bestStars ?? 0) === 3
  ).length;

  // Strong topics: 3-star levels; weak: levels played but < 3★
  const strong = levels
    .filter((lvl) => (progress[lvl.id]?.bestStars ?? 0) === 3)
    .slice(0, 3)
    .map((lvl) => lvl.id);
  const weak = levels
    .filter((lvl) => {
      const p = progress[lvl.id];
      return p && p.bestStars < 3;
    })
    .slice(0, 3)
    .map((lvl) => lvl.id);

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">
          {t('dashboard')}
        </h1>
        <Button
          variant="ghost"
          onClick={() => {
            revoke();
            void navigate('/map');
          }}
        >
          {t('exitParentArea')}
        </Button>
      </div>

      {profile && (
        <Card className="w-full max-w-md mb-4">
          <p className="font-display text-lg text-fg">{profile.nickname}</p>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div>
              <div className="text-2xl">⭐</div>
              <div className="font-display text-xl">{totalStars}</div>
              <div className="text-fg/70 text-xs">{t('totalStars')}</div>
            </div>
            <div>
              <div className="text-2xl">📚</div>
              <div className="font-display text-xl">
                {completedLevels}/{levels.length}
              </div>
              <div className="text-fg/70 text-xs">{t('progress')}</div>
            </div>
            <div>
              <div className="text-2xl">⏱</div>
              <div className="font-display text-xl">
                {formatTime(totalTimeMs)}
              </div>
              <div className="text-fg/70 text-xs">{t('totalTime')}</div>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <CoinBadge count={coins} />
          </div>
        </Card>
      )}

      {strong.length > 0 && (
        <Card className="w-full max-w-md mb-3">
          <p className="font-display text-sm text-fg/70 mb-2">
            {t('strongTopics')}
          </p>
          <div className="flex gap-2 flex-wrap">
            {strong.map((id) => (
              <span
                key={id}
                className="px-3 py-1 rounded-round bg-success/20 text-success font-display text-sm"
              >
                #{id}
              </span>
            ))}
          </div>
        </Card>
      )}

      {weak.length > 0 && (
        <Card className="w-full max-w-md mb-3">
          <p className="font-display text-sm text-fg/70 mb-2">
            {t('weakTopics')}
          </p>
          <div className="flex gap-2 flex-wrap">
            {weak.map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 px-3 py-1 rounded-round bg-warning/20 text-warning font-display text-sm"
              >
                <span>#{id}</span>
                <StarRow stars={progress[id]?.bestStars ?? 0} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          onClick={() => void navigate('/parent/reports/daily')}
        >
          {t('reports')}
        </Button>
        <Button
          variant="primary"
          onClick={() => void navigate('/parent/settings')}
        >
          {t('settings')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => void navigate('/parent/profiles')}
        >
          {t('manageProfiles')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => void navigate('/parent/email-preview')}
        >
          {t('sendReport')}
        </Button>
      </div>
    </main>
  );
}
