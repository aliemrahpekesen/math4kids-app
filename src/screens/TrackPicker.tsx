import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CoinBadge, CharacterAvatar } from '../ui';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { useSettingsStore } from '../state/settingsStore';
import { useAudio } from '../audio/AudioProvider';
import { getTracks } from '../engines/curriculum';
import type { TrackId } from '../engines/types';

/**
 * Big-glyph cluster shown on each track card. Numbers track shows the digits
 * 0–9 dancing; operations track shows the four operators. Reads as a "pictogram"
 * for a non-literate child.
 */
const TRACK_GLYPHS: Record<TrackId, string> = {
  numbers: '1 2 3',
  operations: '+ − × ÷',
};

const TRACK_ICON: Record<TrackId, string> = {
  numbers: '🔢',
  operations: '➕',
};

export function TrackPicker() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson');
  const tracks = getTracks();
  const coins = useRewardStore((s) => s.coins);
  const language = useSettingsStore((s) => s.language);
  const audio = useAudio();
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  useEffect(() => {
    audio.speak(tl('pickYourPath'), language);
    return () => {
      audio.stopSpeaking();
    };
  }, [audio, language, tl]);

  const goTrack = (id: TrackId) => {
    void navigate(`/map/${id}`);
  };

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex items-center justify-between mb-6 px-2">
        {profile ? (
          <button
            type="button"
            onClick={() => void navigate('/profile-picker')}
            className="flex items-center gap-2 min-h-touch px-2"
            aria-label={profile.nickname}
          >
            <CharacterAvatar avatarKey={profile.avatarKey} size="sm" />
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

      <div className="w-full max-w-md flex flex-col gap-5">
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
              <Card className="!p-8 hover:brightness-110">
                <div className="flex items-center justify-center gap-6">
                  <span className="text-7xl" aria-hidden="true">
                    {TRACK_ICON[tr.id]}
                  </span>
                  <span
                    className="font-display text-4xl text-primary-fg tabular-nums"
                    aria-hidden="true"
                  >
                    {TRACK_GLYPHS[tr.id]}
                  </span>
                </div>
              </Card>
            </button>
          ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => void navigate('/leaderboard')}
          className="w-touch h-touch rounded-soft bg-surface/60 text-2xl"
          aria-label="leaderboard"
        >
          🏆
        </button>
        <button
          type="button"
          onClick={() => void navigate('/rewards')}
          className="w-touch h-touch rounded-soft bg-surface/60 text-2xl"
          aria-label="rewards"
        >
          🎁
        </button>
      </div>
    </main>
  );
}
