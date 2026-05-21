// Legacy primitives — these are the named exports old screens import. They
// still work but will be replaced screen-by-screen as the design migration
// progresses.
export { TouchTarget } from './TouchTarget';
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
export { Toast } from './Toast';
export { StarRow } from './StarRow';
export { CoinBadge } from './CoinBadge';
export { ProgressBar } from './ProgressBar';
export {
  CharacterAvatar,
  AVATAR_KEYS,
  type AvatarKey,
} from './CharacterAvatar';
export { LevelNode, type LevelNodeState } from './LevelNode';
export { NumeralTile } from './NumeralTile';
export { DraggableObject, DropZone } from './DraggableObject';

// New design-system primitives. Import directly from `../ui/kit` or
// `../ui/icons` in newly-built screens — listed here for discoverability.
export {
  ChunkyButton,
  Star,
  StarRow as KitStarRow,
  CoinIcon,
  CoinBadge as KitCoinBadge,
  Chest,
  SoftCard,
  BigNumber,
  PulsingRing,
  LevelNode as KitLevelNode,
  Sparkle,
  SpeakButton,
  PageBg,
  type ChestTier,
  type ChestState,
} from './kit';
export * from './icons';
export { AppHeader } from './AppHeader';
export {
  HundredBlock,
  TenBlock,
  OneBlock,
  ObjectGlyph,
  Flag,
} from './blocks';
