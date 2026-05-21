import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { useSettingsStore } from '../state/settingsStore';
import { useProfileStore } from '../state/profileStore';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { validateEmail } from '../engines/parentSettings';

export function ParentEmailPreview() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const { t: tc } = useTranslation('common');
  const settings = useSettingsStore();
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const totalStars = Object.values(progress).reduce(
    (acc, p) => acc + (p?.bestStars ?? 0),
    0
  );
  const completed = Object.values(progress).filter(
    (p) => (p?.bestStars ?? 0) === 3
  ).length;

  const [email, setEmail] = useState(settings.parentEmail);

  const save = () => {
    settings.setParentEmail(email);
  };

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">
          {t('sendReport')}
        </h1>
        <Button
          variant="ghost"
          onClick={() => void navigate('/parent/dashboard')}
        >
          ←
        </Button>
      </div>

      <Card className="w-full max-w-md mb-3">
        <p className="font-display text-fg/70 mb-2">📧</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="parent@example.com"
          className="w-full px-4 py-3 rounded-soft bg-bg/40 text-fg border-2 border-fg/30 focus:border-accent focus:outline-none"
        />
        <p className="text-fg/60 text-xs mt-2">
          {validateEmail(email) || email === ''
            ? ' '
            : '⚠ E-posta formatı geçersiz'}
        </p>
        <Button
          variant="primary"
          onClick={save}
          disabled={email !== '' && !validateEmail(email)}
          className="w-full mt-3"
        >
          {tc('save')}
        </Button>
      </Card>

      <Card className="w-full max-w-md">
        <h2 className="font-display text-lg text-primary-fg mb-3">
          📨 Önizleme
        </h2>
        <div className="bg-bg/60 rounded-soft p-4 text-sm">
          <p className="font-display text-fg mb-2">
            {profile?.nickname ?? 'Çocuk'} — {t('progress')}
          </p>
          <ul className="text-fg/80 space-y-1">
            <li>
              ⭐ {totalStars} {t('totalStars').toLowerCase()}
            </li>
            <li>
              📚 {completed} / 17 {t('progress').toLowerCase()}
            </li>
            <li>🪙 {coins} 🪙</li>
          </ul>
        </div>
        <Button
          variant="ghost"
          disabled
          aria-disabled
          className="w-full mt-4 opacity-60"
        >
          ✉ {t('sendReport')} — {t('sendReportComingSoon')}
        </Button>
      </Card>
    </main>
  );
}
