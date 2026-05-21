import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CharacterAvatar } from '../ui';
import { getLevelById } from '../engines/curriculum';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';

export function LessonIntro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const audio = useAudio();
  const language = useSettingsStore((s) => s.language);
  const levelId = Number(id ?? 1);
  const level = getLevelById(levelId);

  const title = level ? t(`levelTitles.${levelId}`) : '';
  const welcome = t('narration.introWelcome');

  useEffect(() => {
    if (level) audio.speak(`${title}. ${welcome}`, language);
    return () => {
      audio.stopSpeaking();
    };
  }, [title, welcome, level, audio, language]);

  if (!level) {
    return (
      <main className="app-shell">
        <p className="text-fg/70">Bilinmeyen seviye</p>
        <Button variant="primary" onClick={() => void navigate('/map')}>
          {t('backToMap')}
        </Button>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <button
          type="button"
          onClick={() => audio.speak(welcome, language)}
          aria-label="Replay narration"
          className="block mx-auto mb-3"
        >
          <CharacterAvatar avatarKey="astronaut" size="lg" />
        </button>
        <h1 className="font-display text-3xl text-primary-fg mb-2">{title}</h1>
        <p className="text-fg/80 mb-6">{welcome}</p>
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            onClick={() => void navigate(`/lesson/${levelId}/practice`)}
            className="w-full"
          >
            {t('startPractice')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => void navigate(`/lesson/${levelId}/quiz`)}
            className="w-full"
          >
            {t('skipPractice')}
          </Button>
        </div>
      </Card>
    </main>
  );
}
