import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import {
  AVATAR_KEYS,
  CharacterAvatar,
  type AvatarKey,
} from '../ui/CharacterAvatar';

interface DraftProfile {
  nickname: string;
  avatarKey: AvatarKey;
}

/* eslint-disable react-refresh/only-export-components -- module-level draft state colocated with the onboarding screens that share it. */

// Module-level scratch state — survives onboarding-step navigations.
let draft: DraftProfile = { nickname: '', avatarKey: 'fox' };
export function getOnboardingDraft(): DraftProfile {
  return { ...draft };
}
export function setOnboardingDraft(next: Partial<DraftProfile>): void {
  draft = { ...draft, ...next };
}
export function resetOnboardingDraft(): void {
  draft = { nickname: '', avatarKey: 'fox' };
}

/* eslint-enable react-refresh/only-export-components */

export function OnboardingProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation('onboarding');
  const { t: tc } = useTranslation('common');
  const [nickname, setNickname] = useState(draft.nickname);

  const submit = () => {
    if (!nickname.trim()) return;
    setOnboardingDraft({ nickname: nickname.trim() });
    void navigate('/onboarding/avatar');
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-primary-fg mb-4">
          {t('createProfile')}
        </h1>
        <label htmlFor="nickname-input" className="block mb-2 text-fg/80">
          {t('nickname')}
        </label>
        <input
          id="nickname-input"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t('nicknamePlaceholder')}
          className="w-full px-4 py-3 mb-4 rounded-soft bg-bg/40 text-fg border-2 border-fg/30 focus:border-accent focus:outline-none text-xl text-center"
          maxLength={20}
        />
        <Button
          variant="primary"
          onClick={submit}
          disabled={!nickname.trim()}
          className="w-full"
        >
          {tc('next')}
        </Button>
      </Card>
    </main>
  );
}

export function OnboardingAvatar() {
  const navigate = useNavigate();
  const { t } = useTranslation('onboarding');
  const { t: tc } = useTranslation('common');
  const [selected, setSelected] = useState<AvatarKey>(draft.avatarKey);

  const submit = () => {
    setOnboardingDraft({ avatarKey: selected });
    void navigate('/onboarding/theme');
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-primary-fg mb-4">
          {t('chooseAvatar')}
        </h1>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {AVATAR_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-label={key}
              aria-pressed={selected === key}
              className={`p-2 rounded-soft border-4 transition-all min-w-touch min-h-touch ${
                selected === key
                  ? 'border-accent shadow-glow'
                  : 'border-transparent'
              }`}
            >
              <CharacterAvatar avatarKey={key} size="md" />
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={submit} className="w-full">
          {tc('next')}
        </Button>
      </Card>
    </main>
  );
}
