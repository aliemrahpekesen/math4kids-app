import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CharacterAvatar } from '../ui';
import {
  useProfileStore,
  listVisibleProfiles,
  MAX_PROFILES,
} from '../state/profileStore';
import {
  deleteProfile,
  resetProfileProgress,
  switchProfile,
} from '../state/profileActions';
import type { ProfileId } from '../state/types';

export function ParentProfiles() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const { t: tc } = useTranslation('common');
  // Zustand: select raw array (reference-stable) and filter in render body.
  // Filtering inside the selector returns a NEW array each call → infinite re-render.
  const allProfiles = useProfileStore((s) => s.profiles);
  const profiles = listVisibleProfiles(allProfiles);
  const [pendingAction, setPendingAction] = useState<
    { kind: 'reset'; id: ProfileId } | { kind: 'delete'; id: ProfileId } | null
  >(null);

  const runAction = () => {
    if (!pendingAction) return;
    void (async () => {
      if (pendingAction.kind === 'reset') {
        await resetProfileProgress(pendingAction.id);
      } else {
        await deleteProfile(pendingAction.id);
      }
      setPendingAction(null);
    })();
  };

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">
          {t('manageProfiles')}
        </h1>
        <Button
          variant="ghost"
          onClick={() => void navigate('/parent/dashboard')}
        >
          ←
        </Button>
      </div>

      <div className="w-full max-w-md flex flex-col gap-2 mb-4">
        {profiles.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center gap-3 mb-2">
              <CharacterAvatar avatarKey={p.avatarKey} size="sm" />
              <span className="font-display text-lg flex-1">{p.nickname}</span>
              <button
                type="button"
                onClick={() => {
                  void switchProfile(p.id);
                  void navigate('/map');
                }}
                className="px-3 py-1 rounded-soft bg-primary text-primary-fg text-sm font-display"
              >
                ↗
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                onClick={() => setPendingAction({ kind: 'reset', id: p.id })}
              >
                {t('resetProgress')}
              </Button>
              <Button
                variant="danger"
                onClick={() => setPendingAction({ kind: 'delete', id: p.id })}
              >
                {tc('delete')}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {profiles.length < MAX_PROFILES && (
        <Button
          variant="accent"
          onClick={() => void navigate('/onboarding/profile')}
          className="w-full max-w-md mb-2"
        >
          ➕ {t('createNew')}
        </Button>
      )}

      {pendingAction && (
        <Card className="w-full max-w-md fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <p className="font-display mb-3">
            {pendingAction.kind === 'reset'
              ? t('resetProgressConfirm')
              : t('fullWipeConfirm')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => setPendingAction(null)}>
              {tc('cancel')}
            </Button>
            <Button variant="danger" onClick={runAction}>
              {tc('confirm')}
            </Button>
          </div>
        </Card>
      )}
    </main>
  );
}
