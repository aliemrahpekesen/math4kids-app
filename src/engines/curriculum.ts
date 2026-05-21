import path from '../../content/curriculum/path.json';
import type { LevelDescriptor, TrackDescriptor, TrackId } from './types';
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

export function getLevelById(id: number): LevelDescriptor | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getNextLevel(id: number): LevelDescriptor | undefined {
  const level = getLevelById(id);
  if (!level) return undefined;
  // The "next" level is the next one IN THE SAME TRACK — so finishing
  // Numbers L10 doesn't dump the child into Operations L11.
  const sameTrack = getLevelsByTrack(level.track);
  const idx = sameTrack.findIndex((l) => l.id === id);
  return sameTrack[idx + 1];
}

/**
 * A level is unlocked if it has no prereq OR if the prereq's bestStars === 3.
 * Prereqs are within a single track per `path.json` v2 — the two tracks are
 * independently progressable.
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
