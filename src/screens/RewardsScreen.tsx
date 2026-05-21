import { useNavigate } from 'react-router-dom';
import { useTheme } from '../themes/ThemeProvider';
import {
  PageBg,
  SoftCard,
  Star,
  Chest,
  type ChestTier,
  type ChestState,
} from '../ui';
import { IconBack } from '../ui/icons';
import { useRewardStore } from '../state/rewardStore';
import { useProgressStore } from '../state/progressStore';

interface StatTileProps {
  bg: string;
  fg: string;
  icon: string;
  value: number;
  label: string;
}

function StatTile({ bg, fg, icon, value, label }: StatTileProps) {
  return (
    <div
      style={{
        background: bg,
        color: fg,
        borderRadius: 18,
        padding: '12px 10px',
        textAlign: 'center',
        boxShadow:
          'inset 0 -3px 0 rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }} aria-hidden="true">
        {icon}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 26,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginTop: 2,
          opacity: 0.8,
        }}
      >
        {label}
      </div>
    </div>
  );
}

interface ChestCardProps {
  tier: ChestTier;
  state: ChestState;
  label: string;
}

function ChestCard({ tier, state, label }: ChestCardProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  const active = state !== 'locked';
  return (
    <div
      style={{
        background: active ? '#fff' : '#F8FAFC',
        borderRadius: 18,
        padding: '10px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        border: `2px solid ${active ? c.accent : 'transparent'}`,
        boxShadow: active
          ? 'inset 0 -4px 0 rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.06)'
          : '0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      <Chest size={64} state={state} tier={tier} />
      <div
        style={{
          fontFamily: tokens.tokens.font.display,
          fontWeight: 800,
          fontSize: 12,
          color: active ? '#0F172A' : '#94A3B8',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function RewardsScreen() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const coins = useRewardStore((s) => s.coins);
  const chests = useRewardStore((s) => s.chestUnlockedKeys);
  const badges = useRewardStore((s) => s.badges);
  const progress = useProgressStore((s) => s.levels);

  const totalStars = Object.values(progress).reduce(
    (acc, p) => acc + (p?.bestStars ?? 0),
    0
  );

  // Map our 6 tier-final chest keys to {tier, label, state}.
  interface TierRow {
    key: string;
    tier: ChestTier;
    label: string;
  }
  const tierRows: TierRow[] = [
    { key: 'chest-section-9', tier: 'bronze', label: 'Bronz · S 0–9' },
    { key: 'chest-section-17', tier: 'bronze', label: 'Bronz · İ 0–10' },
    { key: 'chest-section-107', tier: 'silver', label: 'Gümüş · S 99' },
    { key: 'chest-section-117', tier: 'silver', label: 'Gümüş · İ 99' },
    { key: 'chest-section-207', tier: 'gold', label: 'Altın · S 999' },
    { key: 'chest-section-217', tier: 'gold', label: 'Altın · İ 999' },
  ];

  const chestState = (key: string): ChestState => {
    if (!chests.includes(key)) return 'locked';
    return 'open';
  };

  const c = tokens.tokens.color;

  return (
    <PageBg>
      <div style={{ padding: '64px 16px 28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            onClick={() => void navigate('/map')}
            aria-label="Geri"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow:
                'inset 0 -3px 0 rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBack size={40} />
          </button>
          <h1
            style={{
              fontFamily: tokens.tokens.font.display,
              fontSize: 22,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
            }}
          >
            Ödüller
          </h1>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 18,
          }}
        >
          <StatTile
            bg="#FEF3C7"
            fg="#92400E"
            icon="⭐"
            value={totalStars}
            label="yıldız"
          />
          <StatTile
            bg="#FEF3C7"
            fg="#92400E"
            icon="🪙"
            value={coins}
            label="altın"
          />
          <StatTile
            bg={c.accentSoft}
            fg={c.accentDark}
            icon="📦"
            value={chests.length}
            label="sandık"
          />
        </div>

        {/* Treasure chests */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
        >
          Hazine Sandıkları
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 18,
          }}
        >
          {tierRows.map((row) => (
            <ChestCard
              key={row.key}
              tier={row.tier}
              state={chestState(row.key)}
              label={row.label}
            />
          ))}
        </div>

        {/* Star wall */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
        >
          Yıldız Duvarı
        </div>
        <SoftCard padding={14}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 6,
              justifyItems: 'center',
            }}
          >
            {Array.from({ length: 28 }, (_, i) => (
              <Star key={i} size={28} on={i < totalStars} />
            ))}
          </div>
        </SoftCard>

        {/* Achievements */}
        {badges.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 8,
              }}
            >
              Rozetler
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}
            >
              {badges.map((b) => (
                <SoftCard key={b.key} padding={10} tinted>
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: 28,
                    }}
                  >
                    🏅
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#0F172A',
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    {b.key}
                  </div>
                </SoftCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageBg>
  );
}
