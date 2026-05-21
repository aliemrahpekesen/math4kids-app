import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CoinBadge, StarRow } from '../ui';
import { useRewardStore } from '../state/rewardStore';
import { useProgressStore } from '../state/progressStore';

const ALL_BADGES: { key: string; emoji: string; labelKey: string }[] = [
  { key: 'first-star', emoji: '⭐', labelKey: 'İlk yıldız' },
  { key: 'first-3-stars', emoji: '🎯', labelKey: 'İlk 3 yıldız' },
  { key: 'numbers-master', emoji: '🔢', labelKey: 'Sayı ustası' },
  { key: 'shape-master', emoji: '🔷', labelKey: 'Şekil ustası' },
  { key: 'add-master', emoji: '➕', labelKey: 'Toplama ustası' },
  { key: 'subtract-master', emoji: '➖', labelKey: 'Çıkarma ustası' },
  { key: 'streak-7', emoji: '🔥', labelKey: '7 gün üst üste' },
  { key: 'final-challenge', emoji: '🏆', labelKey: 'Son zorluk' },
];

export function RewardsScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const coins = useRewardStore((s) => s.coins);
  const badges = useRewardStore((s) => s.badges);
  const chests = useRewardStore((s) => s.chestUnlockedKeys);
  const progress = useProgressStore((s) => s.levels);

  const totalStars = Object.values(progress).reduce(
    (acc, p) => acc + (p?.bestStars ?? 0),
    0
  );

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">🎁</h1>
        <Button variant="ghost" onClick={() => void navigate('/map')}>
          ←
        </Button>
      </div>

      <Card className="w-full max-w-md mb-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-3xl">🪙</div>
            <div className="font-display text-2xl">{coins}</div>
          </div>
          <div>
            <div className="text-3xl">⭐</div>
            <div className="font-display text-2xl">{totalStars}</div>
          </div>
          <div>
            <div className="text-3xl">📦</div>
            <div className="font-display text-2xl">{chests.length}</div>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <CoinBadge count={coins} />
        </div>
      </Card>

      <Card className="w-full max-w-md mb-3">
        <p className="font-display text-fg/70 mb-3">🎖</p>
        <div className="grid grid-cols-4 gap-3">
          {ALL_BADGES.map((b) => {
            const earned = badges.some((ub) => ub.key === b.key);
            return (
              <div
                key={b.key}
                className={`flex flex-col items-center gap-1 p-2 rounded-soft ${
                  earned ? 'bg-accent/20' : 'bg-surface/40 opacity-40 grayscale'
                }`}
                title={b.labelKey}
              >
                <span className="text-3xl" aria-hidden="true">
                  {b.emoji}
                </span>
                <span className="text-fg/80 text-xs text-center font-display">
                  {b.labelKey}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="w-full max-w-md">
        <p className="font-display text-fg/70 mb-2">📦</p>
        {chests.length === 0 ? (
          <p className="text-fg/60 text-sm">
            Henüz kasa açılmadı. 3 yıldız topla, kasa açılsın!
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {chests.map((key) => (
              <div
                key={key}
                className="bg-accent/20 rounded-soft p-3 text-center"
              >
                <div className="text-3xl">📦</div>
                <div className="text-fg/80 text-xs font-display mt-1">
                  {key.replace('chest-section-', 'L≤')}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-3 w-full max-w-md text-center">
        <StarRow stars={3} size="md" />
        <p className="text-fg/60 text-xs mt-2">{t('appName')}</p>
      </div>
    </main>
  );
}
