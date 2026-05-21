import type { Exercise, ExerciseTypeKey, LevelDescriptor } from './types';
import { mulberry32, pickInt, pickN, shuffle } from './rng';
import { getLevelById } from './curriculum';

const SHAPE_KEYS = ['circle', 'square', 'triangle', 'rectangle'] as const;
const SORT_BUCKETS = ['red', 'blue', 'yellow'] as const;
const PATTERN_TOKENS = ['🍎', '🍌', '🍇', '🍊', '🍋'] as const;

interface Ctx {
  rand: () => number;
  level: LevelDescriptor;
  id: string;
}

function exerciseTapNumber({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [1, 10];
  const target = pickInt(rand, min, max);
  const distractorPool = Array.from(
    { length: max - min + 1 },
    (_, i) => i + min
  ).filter((n) => n !== target);
  const distractors = pickN(distractorPool, 3, rand);
  const options = shuffle([target, ...distractors], rand).map(String);
  return {
    id,
    type: 'tap-number',
    prompt: 'questions.tapNumber',
    options,
    correctAnswer: String(target),
    meta: { n: target },
  };
}

function exerciseCountObjects({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [1, 10];
  const count = pickInt(rand, min, max);
  const choices = pickN(
    Array.from({ length: max - min + 1 }, (_, i) => i + min).filter(
      (n) => n !== count
    ),
    3,
    rand
  );
  const options = shuffle([count, ...choices], rand).map(String);
  return {
    id,
    type: 'count-objects',
    prompt: 'questions.countObjects',
    options,
    correctAnswer: String(count),
    meta: { count, glyph: '⭐' },
  };
}

function exerciseMatchQuantity({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [1, 10];
  const target = pickInt(rand, min, max);
  return {
    id,
    type: 'match-quantity',
    prompt: 'questions.matchQuantity',
    options: [String(target)],
    correctAnswer: String(target),
    meta: { quantity: target },
  };
}

function exerciseCompare({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [1, 10];
  const a = pickInt(rand, min, max);
  let b = pickInt(rand, min, max);
  while (a === b) b = pickInt(rand, min, max);
  const askBigger = rand() > 0.5;
  const correct = askBigger ? Math.max(a, b) : Math.min(a, b);
  return {
    id,
    type: 'compare',
    prompt: askBigger ? 'questions.whichBigger' : 'questions.whichSmaller',
    options: shuffle([String(a), String(b)], rand),
    correctAnswer: String(correct),
    meta: { a, b, askBigger },
  };
}

function exerciseShapeTap({ rand, id }: Ctx): Exercise {
  const target = SHAPE_KEYS[pickInt(rand, 0, SHAPE_KEYS.length - 1)]!;
  const distractors = pickN(
    SHAPE_KEYS.filter((s) => s !== target),
    3,
    rand
  );
  return {
    id,
    type: 'shape-tap',
    prompt: 'questions.whichShape',
    options: shuffle([target, ...distractors], rand),
    correctAnswer: target,
    meta: { shape: target },
  };
}

function exercisePatternComplete({ rand, id }: Ctx): Exercise {
  const a = PATTERN_TOKENS[pickInt(rand, 0, PATTERN_TOKENS.length - 1)]!;
  let b = PATTERN_TOKENS[pickInt(rand, 0, PATTERN_TOKENS.length - 1)]!;
  while (b === a)
    b = PATTERN_TOKENS[pickInt(rand, 0, PATTERN_TOKENS.length - 1)]!;
  // AB AB ?
  const sequence = [a, b, a, b];
  const correct = a;
  const distractor = b;
  return {
    id,
    type: 'pattern-complete',
    prompt: 'questions.completePattern',
    options: shuffle([correct, distractor], rand),
    correctAnswer: correct,
    meta: { sequence },
  };
}

function exerciseSortInto({ rand, id }: Ctx): Exercise {
  const bucket = SORT_BUCKETS[pickInt(rand, 0, SORT_BUCKETS.length - 1)]!;
  return {
    id,
    type: 'sort-into',
    prompt: 'questions.sortInto',
    options: [...SORT_BUCKETS],
    correctAnswer: bucket,
    meta: { bucket },
  };
}

function exerciseAddVisual({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [1, 10];
  const a = pickInt(rand, 1, Math.floor(max / 2));
  const b = pickInt(rand, 1, max - a);
  const sum = a + b;
  const distractorPool = Array.from(
    { length: max - min + 1 },
    (_, i) => i + min
  ).filter((n) => n !== sum);
  const distractors = pickN(distractorPool, 3, rand);
  return {
    id,
    type: 'add-visual',
    prompt: 'questions.addUp',
    options: shuffle([sum, ...distractors], rand).map(String),
    correctAnswer: String(sum),
    meta: { a, b, sum },
  };
}

function exerciseSubtractVisual({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [1, 10];
  const a = pickInt(rand, 2, max);
  const b = pickInt(rand, 1, a);
  const diff = a - b;
  const distractorPool = Array.from(
    { length: max - min + 1 },
    (_, i) => i + min
  ).filter((n) => n !== diff);
  const distractors = pickN(distractorPool, 3, rand);
  return {
    id,
    type: 'subtract-visual',
    prompt: 'questions.subtract',
    options: shuffle([diff, ...distractors], rand).map(String),
    correctAnswer: String(diff),
    meta: { a, b, diff },
  };
}

function exerciseMixedAddSub({ rand, level, id }: Ctx): Exercise {
  return rand() > 0.5
    ? exerciseAddVisual({ rand, level, id })
    : exerciseSubtractVisual({ rand, level, id });
}

function exerciseGroupsOf({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [2, 5];
  const groups = pickInt(rand, min, max);
  const each = pickInt(rand, min, max);
  const total = groups * each;
  const distractors = pickN(
    [total - 1, total + 1, total + 2, total + 3, Math.max(1, total - 2)].filter(
      (n) => n !== total
    ),
    3,
    rand
  );
  return {
    id,
    type: 'groups-of',
    prompt: 'questions.groupsOf',
    options: shuffle([total, ...distractors], rand).map(String),
    correctAnswer: String(total),
    meta: { groups, each, total },
  };
}

function exerciseShareEqually({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [2, 5];
  const groups = pickInt(rand, min, max);
  const each = pickInt(rand, min, max);
  const total = groups * each;
  return {
    id,
    type: 'share-equally',
    prompt: 'questions.shareEqually',
    options: [String(each)],
    correctAnswer: String(each),
    meta: { groups, each, total },
  };
}

function exerciseMixedReview(ctx: Ctx): Exercise {
  // Picks one of the prior generators uniformly.
  const pool: ExerciseTypeKey[] = [
    'tap-number',
    'count-objects',
    'compare',
    'add-visual',
    'subtract-visual',
    'shape-tap',
    'groups-of',
  ];
  const pick = pool[pickInt(ctx.rand, 0, pool.length - 1)]!;
  // Use a level that matches the picked type — for mixed-review we just use the parent level
  // but force a sensible range.
  const fakeLevel: LevelDescriptor = {
    ...ctx.level,
    range: ctx.level.range ?? [1, 10],
  };
  return generators[pick]({ ...ctx, level: fakeLevel });
}

const generators: Record<ExerciseTypeKey, (ctx: Ctx) => Exercise> = {
  'tap-number': exerciseTapNumber,
  'count-objects': exerciseCountObjects,
  'match-quantity': exerciseMatchQuantity,
  compare: exerciseCompare,
  'shape-tap': exerciseShapeTap,
  'pattern-complete': exercisePatternComplete,
  'sort-into': exerciseSortInto,
  'add-visual': exerciseAddVisual,
  'subtract-visual': exerciseSubtractVisual,
  'mixed-add-sub': exerciseMixedAddSub,
  'groups-of': exerciseGroupsOf,
  'share-equally': exerciseShareEqually,
  'mixed-review': exerciseMixedReview,
};

export function generate(
  levelId: number,
  seed: number,
  index: number
): Exercise {
  const level = getLevelById(levelId);
  if (!level) throw new Error(`Unknown level: ${levelId}`);
  const rand = mulberry32(seed + index * 31);
  const types = level.exerciseTypes;
  const type = types[index % types.length]!;
  const id = `L${levelId}-${seed}-${index}`;
  return generators[type]({ rand, level, id });
}

export function generateBatch(
  levelId: number,
  seed: number,
  count: number
): Exercise[] {
  return Array.from({ length: count }, (_, i) => generate(levelId, seed, i));
}
