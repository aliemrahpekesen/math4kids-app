const COINS_PER_STAR: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 5,
  2: 10,
  3: 20,
};

/** Section markers — every 4th level closes a section and unlocks a chest. */
const SECTION_BOUNDARIES = new Set<number>([4, 9, 13, 15, 17]);

export interface RewardDelta {
  coins: number;
  badge?: string;
  chest?: string;
}

export function awardForStars(
  stars: 0 | 1 | 2 | 3,
  levelId: number
): RewardDelta {
  const coins = COINS_PER_STAR[stars];
  const delta: RewardDelta = { coins };
  if (stars === 3 && levelId === 17) {
    delta.badge = 'final-challenge';
  }
  if (stars === 3 && SECTION_BOUNDARIES.has(levelId)) {
    delta.chest = `chest-section-${levelId}`;
  }
  return delta;
}
