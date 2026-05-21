import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CharacterAvatar } from '../ui';
import type { AvatarKey } from '../ui/CharacterAvatar';
import { repos, type LeaderboardEntry } from '../repos';

type Cadence = 'daily' | 'weekly' | 'monthly' | 'yearly';
const CADENCES: Cadence[] = ['daily', 'weekly', 'monthly', 'yearly'];

const RANK_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tp } = useTranslation('parent');
  const [cadence, setCadence] = useState<Cadence>('daily');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    void repos.leaderboard.query({ cadence, limit: 20 }).then(setEntries);
  }, [cadence]);

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">
          🏆 {t('home')}
        </h1>
        <Button variant="ghost" onClick={() => void navigate('/map')}>
          ←
        </Button>
      </div>

      <div className="w-full max-w-md grid grid-cols-4 gap-1 mb-4">
        {CADENCES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCadence(c)}
            aria-pressed={c === cadence}
            className={`px-2 py-2 rounded-soft font-display text-sm min-h-touch ${
              c === cadence ? 'bg-accent text-accent-fg' : 'bg-surface text-fg'
            }`}
          >
            {tp(
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
        <ul className="space-y-2">
          {entries.map((e) => {
            const isSelf = Boolean(e.isSelf);
            return (
              <li
                key={`${cadence}-${e.rank}-${e.nickname}`}
                className={`flex items-center gap-3 p-2 rounded-soft ${
                  isSelf ? 'bg-accent/20 ring-2 ring-accent/40' : 'bg-bg/40'
                }`}
              >
                <span
                  className="font-display text-xl w-8 text-center"
                  aria-label={`rank ${e.rank}`}
                >
                  {RANK_EMOJI[e.rank] ?? e.rank}
                </span>
                <CharacterAvatar
                  avatarKey={e.avatarKey as AvatarKey}
                  size="sm"
                />
                <span className="font-display flex-1">{e.nickname}</span>
                <span className="font-display text-fg/70 flex items-center gap-1">
                  ⭐ {e.stars}
                </span>
              </li>
            );
          })}
        </ul>
        {entries.length === 0 && (
          <p className="text-fg/60 text-center py-6">…</p>
        )}
      </Card>
    </main>
  );
}
