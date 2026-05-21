import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, CharacterAvatar } from '../ui';
import { getLevelById } from '../engines/curriculum';

export function LessonIntro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const levelId = Number(id ?? 1);
  const level = getLevelById(levelId);

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

  const title = t(`levelTitles.${levelId}`);

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <CharacterAvatar
          avatarKey="astronaut"
          size="lg"
          className="mx-auto mb-3"
        />
        <h1 className="font-display text-3xl text-primary-fg mb-2">{title}</h1>
        <p className="text-fg/80 mb-6">{t('narration.introWelcome')}</p>
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
