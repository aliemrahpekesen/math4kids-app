import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CharacterAvatar } from '../ui';
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
        <button
          type="button"
          onClick={() => void navigate('/map')}
          aria-label={t('backToMap')}
          className="w-touch h-touch rounded-soft bg-surface/60 text-3xl"
        >
          🏠
        </button>
      </main>
    );
  }

  const onPlay = () => {
    const next = level.range ? 'teach' : 'practice';
    void navigate(`/lesson/${levelId}/${next}`);
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <button
          type="button"
          onClick={() => audio.speak(welcome, language)}
          aria-label="Replay narration"
          className="block mx-auto mb-6"
        >
          <CharacterAvatar avatarKey="space-astronaut" size="lg" />
        </button>
        <button
          type="button"
          onClick={onPlay}
          aria-label={t('startTeach')}
          className="mx-auto block w-28 h-28 rounded-full bg-accent text-accent-fg text-6xl shadow-glow active:scale-95 transition-transform"
        >
          ▶
        </button>
      </Card>
    </main>
  );
}
