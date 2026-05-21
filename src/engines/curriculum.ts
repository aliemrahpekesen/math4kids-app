import path from '../../content/curriculum/path.json';
import type { LevelDescriptor } from './types';
import type { LevelProgress } from '../state/types';

const LEVELS: LevelDescriptor[] = path.levels as unknown as LevelDescriptor[];

export function getCurriculum(): LevelDescriptor[] {
  return LEVELS;
}

export function getLevelById(id: number): LevelDescriptor | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getNextLevel(id: number): LevelDescriptor | undefined {
  const idx = LEVELS.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  return LEVELS[idx + 1];
}

/**
 * A level is unlocked if it has no prereq OR if the prereq's bestStars === 3.
 */
export function isUnlocked(
  progress: Record<number, LevelProgress | undefined>,
  levelId: number
): boolean {
  const level = getLevelById(levelId);
  if (!level) return false;
  if (level.prereq === null) return true;
  const prereqProgress = progress[level.prereq];
  return (prereqProgress?.bestStars ?? 0) === 3;
}

export const FIRST_LEVEL_ID = 1;
export const FINAL_LEVEL_ID = 17;
