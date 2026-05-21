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
  | 'mixed-review';

export type TopicKey =
  | 'numbers-1-5'
  | 'counting-1-5'
  | 'numbers-6-10'
  | 'counting-6-10'
  | 'match'
  | 'compare'
  | 'shapes'
  | 'patterns'
  | 'sorting'
  | 'numbers-11-20'
  | 'add'
  | 'subtract'
  | 'mixed-as'
  | 'mult-foundations'
  | 'div-foundations'
  | 'mixed-review'
  | 'final';

export interface LevelDescriptor {
  id: number;
  topic: TopicKey;
  exerciseTypes: ExerciseTypeKey[];
  prereq: number | null;
  narrationKey: string;
  range?: [number, number];
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
