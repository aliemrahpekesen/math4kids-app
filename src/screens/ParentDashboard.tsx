import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { useSessionStore } from '../state/sessionStore';
import { getCurriculum } from '../engines/curriculum';
import { exitToHome } from '../routing/exitToHome';
import { CharacterAvatar } from '../ui';

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}s ${m}d`;
  return `${m}d`;
}

interface StatBoxProps {
  value: string | number;
  label: string;
}

function StatBox({ value, label }: StatBoxProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '10px 12px',
        border: '1px solid #E2E8F0',
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#0F172A',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: '#64748B',
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

interface RowProps {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function Row({ icon, label, onClick, danger = false }: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        textAlign: 'left',
        color: danger ? '#DC2626' : '#0F172A',
        fontSize: 14,
        fontWeight: 600,
        width: '100%',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          background: '#F1F5F9',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ color: '#CBD5E1' }}>›</span>
    </button>
  );
}

export function ParentDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const levels = getCurriculum();
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );
  const revoke = useSessionStore((s) => s.revokeParentGate);

  const totalStars = Object.values(progress).reduce(
    (acc, p) => acc + (p?.bestStars ?? 0),
    0
  );
  const totalTimeMs = Object.values(progress).reduce(
    (acc, p) => acc + (p?.totalTimeMs ?? 0),
    0
  );
  const completedLevels = Object.values(progress).filter(
    (p) => (p?.bestStars ?? 0) === 3
  ).length;

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#F8FAFC',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: '#fff',
          padding: '64px 18px 14px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
          }}
        >
          <button
            type="button"
            onClick={() => {
              revoke();
              void exitToHome(navigate);
            }}
            aria-label={t('exitParentArea')}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#F1F5F9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            ←
          </button>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              flex: 1,
            }}
          >
            {t('dashboard')}
          </h1>
        </div>

        {profile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: '#F8FAFC',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E2E8F0',
              }}
            >
              <CharacterAvatar avatarKey={profile.avatarKey} size="sm" />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#0F172A',
                }}
              >
                {profile.nickname}
              </div>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                {profile.difficulty === 'easy'
                  ? 'Kolay'
                  : profile.difficulty === 'medium'
                    ? 'Orta'
                    : 'Zor'}
                {' · '}
                {profile.themeKey === 'space'
                  ? 'Uzay'
                  : profile.themeKey === 'jungle'
                    ? 'Orman'
                    : profile.themeKey === 'ocean'
                      ? 'Okyanus'
                      : 'Şekerler'}{' '}
                teması
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ padding: '16px 18px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <StatBox value={`${formatTime(totalTimeMs)}`} label="Toplam süre" />
          <StatBox
            value={`${completedLevels}/${levels.length}`}
            label="Tamamlanan seviye"
          />
          <StatBox value={totalStars} label="Yıldız" />
        </div>

        {/* Sections */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}
        >
          Hesap
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          <Row
            icon="📊"
            label={t('reports')}
            onClick={() => void navigate('/parent/reports/daily')}
          />
          <Row
            icon="⚙️"
            label={t('settings')}
            onClick={() => void navigate('/parent/settings')}
          />
          <Row
            icon="👨‍👩‍👧"
            label={t('manageProfiles')}
            onClick={() => void navigate('/parent/profiles')}
          />
          <Row
            icon="📧"
            label={t('sendReport')}
            onClick={() => void navigate('/parent/email-preview')}
          />
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #FCA5A5',
            padding: '12px 14px',
            color: '#DC2626',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Altın: {coins}</span>
          <button
            type="button"
            onClick={() => {
              revoke();
              void exitToHome(navigate);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#DC2626',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {t('exitParentArea')} →
          </button>
        </div>
      </div>
    </div>
  );
}
