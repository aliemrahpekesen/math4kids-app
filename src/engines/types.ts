export type ExerciseTypeKey =
  | 'tap-number'
  | 'count-objects'
  | 'match-quantity'
  | 'compare'
  | 'shape-tap'
  | 'pattern-complete'
  | 'sort-into'
  | 'add-visual'
  | 'subtract-visual'
  | 'mixed-add-sub'
  | 'groups-of'
  | 'share-equally'
  | 'mixed-review'
  // Medium / Hard additions:
  | 'tap-number-2digit'
  | 'tap-number-3digit'
  | 'count-tens'
  | 'place-value-2digit'
  | 'place-value-3digit'
  | 'compare-2digit'
  | 'compare-3digit'
  | 'skip-counting'
  | 'mixed-review-2digit'
  | 'mixed-review-3digit'
  | 'add-numeric'
  | 'sub-numeric'
  | 'add-2digit-no-carry'
  | 'sub-2digit-no-regroup'
  | 'add-2digit-carry'
  | 'sub-2digit-regroup'
  | 'mult-small'
  | 'div-small'
  | 'mult-1d-by-2d'
  | 'div-with-remainder'
  | 'add-3digit'
  | 'sub-3digit'
  | 'mixed-review-ops-medium'
  | 'mixed-review-ops-hard';

/** Topic identifier used as an i18n key for level titles. Loose typing — */
/** path.json drives this so adding levels doesn't require code changes. */
export type TopicKey = string;

export type TrackId = 'numbers' | 'operations';

export type LevelDifficulty = 'easy' | 'medium' | 'hard';

export interface LevelDescriptor {
  id: number;
  track: TrackId;
  /** Which difficulty tier this level belongs to. The map filters by the */
  /** active profile's difficulty so each tier sees its own curriculum. */
  difficulty: LevelDifficulty;
  topic: TopicKey;
  exerciseTypes: ExerciseTypeKey[];
  prereq: number | null;
  narrationKey: string;
  range?: [number, number];
}

export interface TrackDescriptor {
  id: TrackId;
  labelKey: string;
  order: number;
}

export interface Exercise {
  id: string;
  type: ExerciseTypeKey;
  prompt: string;
  /** Display payload — choices and labels are stringly-typed for v1 simplicity. */
  options: string[];
  correctAnswer: string;
  /** Optional descriptive payload (e.g., shapes, group counts) for the renderer. */
  meta?: Record<string, unknown>;
}

export interface Quiz {
  levelId: number;
  seed: number;
  items: Exercise[];
}

export interface QuizScore {
  accuracy: number;
  correct: number;
  total: number;
  stars: 0 | 1 | 2 | 3;
}
