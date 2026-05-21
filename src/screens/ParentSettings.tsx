import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { useSettingsStore } from '../state/settingsStore';
import { setLocale } from '../i18n/setup';
import type { Language } from '../state/types';
import type { ThemeKey } from '../themes/types';
import { useTheme } from '../themes/ThemeProvider';

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <span className="font-display text-fg">{label}</span>
      <input
        type="checkbox"
        className="w-6 h-6 accent-accent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function ParentSettings() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const { t: tc } = useTranslation('common');
  const settings = useSettingsStore();
  const { setTheme } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);

  const changeLanguage = (lang: Language) => {
    void setLocale(lang);
    settings.setLanguage(lang);
  };

  const changeTheme = (theme: ThemeKey) => {
    settings.setTheme(theme);
    setTheme(theme);
  };

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="font-display text-2xl text-primary-fg">
          {t('settings')}
        </h1>
        <Button
          variant="ghost"
          onClick={() => void navigate('/parent/dashboard')}
        >
          ←
        </Button>
      </div>

      <Card className="w-full max-w-md mb-3">
        <ToggleRow
          label={t('audioOn')}
          checked={settings.audioOn}
          onChange={settings.setAudio}
        />
        <ToggleRow
          label={t('musicOn')}
          checked={settings.musicOn}
          onChange={settings.setMusic}
        />
        <ToggleRow
          label={t('narrationRepeat')}
          checked={settings.narrationRepeatOn}
          onChange={settings.setNarrationRepeat}
        />
        <ToggleRow
          label={t('leaderboardVisible')}
          checked={settings.leaderboardVisible}
          onChange={settings.setLeaderboardVisible}
        />
      </Card>

      <Card className="w-full max-w-md mb-3">
        <p className="font-display text-fg/70 mb-2">{tc('language')}</p>
        <div className="grid grid-cols-3 gap-2">
          {(['tr', 'en', 'de'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => changeLanguage(l)}
              aria-pressed={settings.language === l}
              className={`px-3 py-2 rounded-soft min-h-touch font-display ${
                settings.language === l
                  ? 'bg-accent text-accent-fg'
                  : 'bg-surface text-fg'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </Card>

      <Card className="w-full max-w-md mb-3">
        <p className="font-display text-fg/70 mb-2">{tc('theme')}</p>
        <div className="grid grid-cols-4 gap-2">
          {(['space', 'jungle', 'ocean', 'candy'] as const).map((th) => (
            <button
              key={th}
              type="button"
              onClick={() => changeTheme(th)}
              aria-pressed={settings.theme === th}
              className={`px-2 py-3 rounded-soft min-h-touch ${
                settings.theme === th
                  ? 'bg-accent text-accent-fg'
                  : 'bg-surface text-fg'
              }`}
            >
              {th[0]?.toUpperCase()}
              {th.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <Card className="w-full max-w-md">
        {!confirmReset ? (
          <Button
            variant="danger"
            onClick={() => setConfirmReset(true)}
            className="w-full"
          >
            {t('resetProgress')}
          </Button>
        ) : (
          <div>
            <p className="text-fg/90 mb-3">{t('resetProgressConfirm')}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                {tc('cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  // Reset is wired in profile actions; but for the active profile only.
                  // Triggered here would call resetProfileProgress(activeProfileId).
                  // Keep this minimal — actual reset path lives in /parent/profiles.
                  setConfirmReset(false);
                  void navigate('/parent/profiles');
                }}
              >
                {tc('confirm')}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
