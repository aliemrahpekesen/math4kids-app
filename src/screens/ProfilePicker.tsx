import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CharacterAvatar } from '../ui';
import {
  useProfileStore,
  MAX_PROFILES,
  listVisibleProfiles,
} from '../state/profileStore';
import { switchProfile } from '../state/profileActions';
import type { ProfileId } from '../state/types';

export function ProfilePicker() {
  const navigate = useNavigate();
  const { t } = useTranslation('onboarding');
  const profiles = useProfileStore((s) => listVisibleProfiles(s.profiles));

  const pick = (id: ProfileId) => {
    void (async () => {
      await switchProfile(id);
      await navigate('/map');
    })();
  };

  const addNew = () => {
    void navigate('/onboarding/profile');
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full">
        <h1 className="font-display text-2xl text-primary-fg mb-4 text-center">
          {t('selectProfile')}
        </h1>

        <div className="flex flex-col gap-2 mb-4">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p.id)}
              className="flex items-center gap-3 p-3 rounded-soft bg-bg/40 hover:bg-primary/20 min-h-touch"
              aria-label={p.nickname}
            >
              <CharacterAvatar avatarKey={p.avatarKey} size="sm" />
              <span className="font-display text-lg">{p.nickname}</span>
            </button>
          ))}
        </div>

        {profiles.length < MAX_PROFILES && (
          <Button variant="accent" onClick={addNew} className="w-full">
            ➕ {t('addNewProfile')}
          </Button>
        )}
      </Card>
    </main>
  );
}
