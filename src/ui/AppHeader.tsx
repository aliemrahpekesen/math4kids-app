/**
 * AppHeader — top bar used inside the game screens: optional back button +
 * avatar chip + coin badge + optional parent lock. Ported from
 * design_files/kit.jsx :: AppHeader.
 */
import type { ReactNode } from 'react';
import { useTheme } from '../themes/ThemeProvider';
import { CharacterAvatar, type AvatarKey } from './CharacterAvatar';
import { CoinBadge } from './kit';
import { IconBack, IconLock } from './icons';

interface AppHeaderProps {
  avatarKey?: AvatarKey;
  name?: string;
  coins?: number;
  showLock?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onLockTap?: () => void;
  onAvatarTap?: () => void;
  rightAction?: ReactNode;
}

export function AppHeader({
  avatarKey,
  name,
  coins = 0,
  showLock = true,
  showBack = false,
  onBack,
  onLockTap,
  onAvatarTap,
  rightAction,
}: AppHeaderProps) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
      }}
    >
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Geri"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconBack size={44} />
        </button>
      )}
      {avatarKey && (
        <button
          type="button"
          onClick={onAvatarTap}
          aria-label={name ?? 'profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 44,
            padding: '0 14px 0 4px',
            borderRadius: 999,
            background: '#fff',
            border: 'none',
            cursor: onAvatarTap ? 'pointer' : 'default',
            boxShadow:
              'inset 0 -3px 0 rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              overflow: 'hidden',
              background: tokens.tokens.color.accentSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CharacterAvatar avatarKey={avatarKey} size="sm" />
          </div>
          {name && (
            <span
              style={{
                fontFamily: tokens.tokens.font.display,
                fontWeight: 800,
                fontSize: 16,
                color: '#1F2937',
              }}
            >
              {name}
            </span>
          )}
        </button>
      )}
      <div style={{ flex: 1 }} />
      {rightAction}
      <CoinBadge count={coins} />
      {showLock && (
        <button
          type="button"
          onClick={onLockTap}
          aria-label="Ebeveyn"
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconLock size={42} color="#fff" stroke="#475569" />
        </button>
      )}
    </div>
  );
}
