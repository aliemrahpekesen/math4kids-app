import path from '../../content/curriculum/path.json';
import type {
  LevelDescriptor,
  LevelDifficulty,
  TrackDescriptor,
  TrackId,
} from './types';
import type { LevelProgress } from '../state/types';

const LEVELS: LevelDescriptor[] = path.levels as unknown as LevelDescriptor[];
const TRACKS: TrackDescriptor[] = (path as { tracks?: TrackDescriptor[] })
  .tracks ?? [
  { id: 'numbers', labelKey: 'tracks.numbers', order: 1 },
  { id: 'operations', labelKey: 'tracks.operations', order: 2 },
];

export function getCurriculum(): LevelDescriptor[] {
  return LEVELS;
}

export function getTracks(): TrackDescriptor[] {
  return TRACKS;
}

export function getLevelsByTrack(track: TrackId): LevelDescriptor[] {
  return LEVELS.filter((l) => l.track === track);
}

/** Levels filtered by (track, difficulty) — drives the Map screen. */
export function getLevelsForTrackAndDifficulty(
  track: TrackId,
  difficulty: LevelDifficulty
): LevelDescriptor[] {
  return LEVELS.filter(
    (l) => l.track === track && l.difficulty === difficulty
  );
}

export function getLevelById(id: number): LevelDescriptor | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getNextLevel(id: number): LevelDescriptor | undefined {
  const level = getLevelById(id);
  if (!level) return undefined;
  // "Next" is the next level in the SAME (track, difficulty) tier so the
  // child never bleeds from easy into medium without parental opt-in.
  const tier = getLevelsForTrackAndDifficulty(level.track, level.difficulty);
  const idx = tier.findIndex((l) => l.id === id);
  return tier[idx + 1];
}

/**
 * A level is unlocked if it has no prereq OR if the prereq's bestStars === 3.
 * Prereqs are within a single (track, difficulty) tier per `path.json` v3.
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
export const FINAL_LEVEL_ID = Math.max(...LEVELS.map((l) => l.id));
