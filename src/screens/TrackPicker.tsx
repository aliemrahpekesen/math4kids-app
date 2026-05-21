import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CoinBadge, CharacterAvatar } from '../ui';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { getTracks } from '../engines/curriculum';
import type { TrackId } from '../engines/types';

const TRACK_EMOJI: Record<TrackId, string> = {
  numbers: '🔢',
  operations: '➕',
};

export function TrackPicker() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson');
  const tracks = getTracks();
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  const goTrack = (id: TrackId) => {
    void navigate(`/map/${id}`);
  };

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        {profile ? (
          <button
            type="button"
            onClick={() => void navigate('/profile-picker')}
            className="flex items-center gap-2 min-h-touch px-2"
            aria-label={profile.nickname}
          >
            <CharacterAvatar avatarKey={profile.avatarKey} size="sm" />
            <span className="font-display">{profile.nickname}</span>
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <CoinBadge count={coins} />
          <button
            type="button"
            onClick={() => void navigate('/parent/gate')}
            className="min-w-touch min-h-touch px-3 rounded-soft bg-surface/60 text-fg"
            aria-label={t('parent')}
          >
            🔒
          </button>
        </div>
      </div>

      <h1 className="font-display text-2xl text-primary-fg text-center mb-6">
        {tl('pickYourPath')}
      </h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        {tracks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((tr) => (
            <button
              key={tr.id}
              type="button"
              onClick={() => goTrack(tr.id)}
              aria-label={tl(tr.labelKey)}
              className="block w-full text-left transition-transform active:scale-95"
            >
              <Card className="!p-6 hover:brightness-110">
                <div className="flex items-center gap-4">
                  <span className="text-5xl" aria-hidden="true">
                    {TRACK_EMOJI[tr.id]}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-2xl text-primary-fg">
                      {tl(tr.labelKey)}
                    </p>
                    <p className="text-fg/70 text-sm mt-1">
                      {tl(`trackDescriptions.${tr.id}`)}
                    </p>
                  </div>
                  <span className="text-fg/40 text-2xl" aria-hidden="true">
                    →
                  </span>
                </div>
              </Card>
            </button>
          ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => void navigate('/leaderboard')}
          className="px-4 py-2 rounded-soft bg-surface/60 text-fg font-display min-h-touch"
        >
          🏆
        </button>
        <button
          type="button"
          onClick={() => void navigate('/rewards')}
          className="px-4 py-2 rounded-soft bg-surface/60 text-fg font-display min-h-touch"
        >
          🎁
        </button>
      </div>
    </main>
  );
}
