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

/* =========================================================================
 *  Medium / Hard tier generators (2-digit, 3-digit, place value, arithmetic)
 * ========================================================================= */

function distractorsNear(
  rand: () => number,
  target: number,
  min: number,
  max: number,
  n: number
): number[] {
  // Candidates near the target so they remain plausible distractors.
  const pool: number[] = [];
  for (const delta of [1, -1, 2, -2, 3, -3, 10, -10, 5, -5]) {
    const v = target + delta;
    if (v >= min && v <= max && v !== target && !pool.includes(v)) {
      pool.push(v);
    }
  }
  while (pool.length < n) {
    // Filler: random within range.
    const v = pickInt(rand, min, max);
    if (v !== target && !pool.includes(v)) pool.push(v);
  }
  return pickN(pool, n, rand);
}

function exerciseTapNumber2Digit({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [10, 99];
  const target = pickInt(rand, min, max);
  const opts = shuffle([target, ...distractorsNear(rand, target, min, max, 3)], rand);
  return {
    id,
    type: 'tap-number-2digit',
    prompt: 'questions.tapNumber',
    options: opts.map(String),
    correctAnswer: String(target),
    meta: { n: target },
  };
}

function exerciseTapNumber3Digit({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [100, 999];
  const target = pickInt(rand, min, max);
  const opts = shuffle([target, ...distractorsNear(rand, target, min, max, 3)], rand);
  return {
    id,
    type: 'tap-number-3digit',
    prompt: 'questions.tapNumber',
    options: opts.map(String),
    correctAnswer: String(target),
    meta: { n: target },
  };
}

function exerciseCountTens({ rand, level, id }: Ctx): Exercise {
  const [, max] = level.range ?? [10, 99];
  const tens = pickInt(rand, 1, Math.min(9, Math.floor(max / 10)));
  const ones = pickInt(rand, 0, 9);
  const total = tens * 10 + ones;
  const opts = shuffle(
    [total, total + 10, total - 10, total + 1].filter((v, i, a) => a.indexOf(v) === i && v >= 0),
    rand
  ).slice(0, 4);
  while (opts.length < 4) opts.push(pickInt(rand, 1, 99));
  return {
    id,
    type: 'count-tens',
    prompt: 'questions.countTens',
    options: opts.map(String),
    correctAnswer: String(total),
    meta: { tens, ones, total },
  };
}

function exercisePlaceValue2Digit({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [10, 99];
  const n = pickInt(rand, min, max);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  // Ask either "how many tens?" or "how many ones?" — coin-flip.
  const askTens = rand() > 0.5;
  const target = askTens ? tens : ones;
  const opts = shuffle(
    [target, (target + 1) % 10, (target + 9) % 10, (target + 2) % 10].filter(
      (v, i, a) => a.indexOf(v) === i
    ),
    rand
  ).slice(0, 4);
  while (opts.length < 4) opts.push(pickInt(rand, 0, 9));
  return {
    id,
    type: 'place-value-2digit',
    prompt: askTens ? 'questions.howManyTens' : 'questions.howManyOnes',
    options: opts.map(String),
    correctAnswer: String(target),
    meta: { n, tens, ones, askTens },
  };
}

function exercisePlaceValue3Digit({ rand, level, id }: Ctx): Exercise {
  const [min, max] = level.range ?? [100, 999];
  const n = pickInt(rand, min, max);
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  const choice = pickInt(rand, 0, 2);
  const promptKey = ['questions.howManyHundreds', 'questions.howManyTens', 'questions.howManyOnes'][choice]!;
  const target = [hundreds, tens, ones][choice]!;
  const opts = shuffle(
    [target, (target + 1) % 10, (target + 9) % 10, (target + 2) % 10].filter(
      (v, i, a) => a.indexOf(v) === i
    ),
    rand
  ).slice(0, 4);
  while (opts.length < 4) opts.push(pickInt(rand, 0, 9));
  return {
    id,
    type: 'place-value-3digit',
    prompt: promptKey,
    options: opts.map(String),
    correctAnswer: String(target),
    meta: { n, hundreds, tens, ones, choice },
  };
}

function compareGeneric(ctx: Ctx, kind: 'compare-2digit' | 'compare-3digit'): Exercise {
  const { rand, level, id } = ctx;
  const [min, max] = level.range ?? (kind === 'compare-2digit' ? [10, 99] : [100, 999]);
  const a = pickInt(rand, min, max);
  let b = pickInt(rand, min, max);
  while (a === b) b = pickInt(rand, min, max);
  const askBigger = rand() > 0.5;
  const correct = askBigger ? Math.max(a, b) : Math.min(a, b);
  return {
    id,
    type: kind,
    prompt: askBigger ? 'questions.whichBigger' : 'questions.whichSmaller',
    options: shuffle([String(a), String(b)], rand),
    correctAnswer: String(correct),
    meta: { a, b, askBigger },
  };
}

function exerciseCompare2Digit(ctx: Ctx): Exercise {
  return compareGeneric(ctx, 'compare-2digit');
}
function exerciseCompare3Digit(ctx: Ctx): Exercise {
  return compareGeneric(ctx, 'compare-3digit');
}

function exerciseSkipCounting({ rand, level, id }: Ctx): Exercise {
  // Show "10, 20, 30, ?, 50" — pick the missing step.
  const [, max] = level.range ?? [10, 100];
  const step = max >= 200 ? 100 : 10;
  const start = pickInt(rand, 1, Math.max(1, Math.floor(max / step) - 5)) * step;
  const sequence = [start, start + step, start + 2 * step, start + 3 * step];
  const missingIdx = pickInt(rand, 1, 3);
  const correct = sequence[missingIdx]!;
  const display = sequence.map((v, i) => (i === missingIdx ? '?' : String(v)));
  const opts = shuffle(
    [correct, correct + step, correct - step, correct + 1].filter(
      (v, i, a) => a.indexOf(v) === i && v >= 0
    ),
    rand
  ).slice(0, 4);
  while (opts.length < 4) opts.push(pickInt(rand, 1, max));
  return {
    id,
    type: 'skip-counting',
    prompt: 'questions.skipCounting',
    options: opts.map(String),
    correctAnswer: String(correct),
    meta: { display, step },
  };
}

function arithmeticGeneric(
  ctx: Ctx,
  type: ExerciseTypeKey,
  op: '+' | '-' | '×' | '÷',
  a: number,
  b: number,
  result: number,
  promptKey: string
): Exercise {
  const { rand, id } = ctx;
  const distractors: number[] = [];
  for (const delta of [1, -1, 10, -10, 2, -2, 5, -5]) {
    const v = result + delta;
    if (v >= 0 && v !== result && !distractors.includes(v)) distractors.push(v);
    if (distractors.length >= 3) break;
  }
  return {
    id,
    type,
    prompt: promptKey,
    options: shuffle([result, ...distractors], rand).map(String),
    correctAnswer: String(result),
    meta: { a, b, op, result, expression: `${a} ${op} ${b}` },
  };
}

function exerciseAddNumeric(ctx: Ctx): Exercise {
  const [min, max] = ctx.level.range ?? [10, 20];
  const a = pickInt(ctx.rand, min, max);
  const b = pickInt(ctx.rand, 1, max - a < 1 ? 1 : max - a);
  return arithmeticGeneric(ctx, 'add-numeric', '+', a, b, a + b, 'questions.addUp');
}

function exerciseSubNumeric(ctx: Ctx): Exercise {
  const [min, max] = ctx.level.range ?? [10, 20];
  const a = pickInt(ctx.rand, min, max);
  const b = pickInt(ctx.rand, 1, a);
  return arithmeticGeneric(ctx, 'sub-numeric', '-', a, b, a - b, 'questions.subtract');
}

function exerciseAdd2digitNoCarry(ctx: Ctx): Exercise {
  // Guarantee no carry: both ones-digits sum ≤ 9, both tens-digits sum ≤ 9.
  const t1 = pickInt(ctx.rand, 1, 4);
  const t2 = pickInt(ctx.rand, 1, 9 - t1);
  const o1 = pickInt(ctx.rand, 0, 4);
  const o2 = pickInt(ctx.rand, 0, 9 - o1);
  const a = t1 * 10 + o1;
  const b = t2 * 10 + o2;
  return arithmeticGeneric(ctx, 'add-2digit-no-carry', '+', a, b, a + b, 'questions.addUp');
}

function exerciseSub2digitNoRegroup(ctx: Ctx): Exercise {
  // Both ones-digit and tens-digit of a ≥ b's.
  const t1 = pickInt(ctx.rand, 4, 9);
  const t2 = pickInt(ctx.rand, 1, t1);
  const o1 = pickInt(ctx.rand, 1, 9);
  const o2 = pickInt(ctx.rand, 0, o1);
  const a = t1 * 10 + o1;
  const b = t2 * 10 + o2;
  return arithmeticGeneric(ctx, 'sub-2digit-no-regroup', '-', a, b, a - b, 'questions.subtract');
}

function exerciseAdd2digitCarry(ctx: Ctx): Exercise {
  // Force a carry from ones to tens.
  const t1 = pickInt(ctx.rand, 1, 7);
  const t2 = pickInt(ctx.rand, 1, 7);
  const o1 = pickInt(ctx.rand, 5, 9);
  const o2 = pickInt(ctx.rand, 10 - o1, 9);
  const a = t1 * 10 + o1;
  const b = t2 * 10 + o2;
  return arithmeticGeneric(ctx, 'add-2digit-carry', '+', a, b, a + b, 'questions.addUp');
}

function exerciseSub2digitRegroup(ctx: Ctx): Exercise {
  // Force regrouping: ones-digit of a < b's.
  const t1 = pickInt(ctx.rand, 5, 9);
  const t2 = pickInt(ctx.rand, 1, t1 - 1);
  const o1 = pickInt(ctx.rand, 0, 4);
  const o2 = pickInt(ctx.rand, o1 + 1, 9);
  const a = t1 * 10 + o1;
  const b = t2 * 10 + o2;
  return arithmeticGeneric(ctx, 'sub-2digit-regroup', '-', a, b, a - b, 'questions.subtract');
}

function exerciseMultSmall(ctx: Ctx): Exercise {
  const [min, max] = ctx.level.range ?? [2, 10];
  const a = pickInt(ctx.rand, 2, 10);
  const b = pickInt(ctx.rand, min, max);
  return arithmeticGeneric(ctx, 'mult-small', '×', a, b, a * b, 'questions.multiply');
}

function exerciseDivSmall(ctx: Ctx): Exercise {
  const b = pickInt(ctx.rand, 2, 10);
  const q = pickInt(ctx.rand, 1, 10);
  const a = b * q;
  return arithmeticGeneric(ctx, 'div-small', '÷', a, b, q, 'questions.divide');
}

function exerciseMult1dBy2d(ctx: Ctx): Exercise {
  const a = pickInt(ctx.rand, 11, 30);
  const b = pickInt(ctx.rand, 2, 9);
  return arithmeticGeneric(ctx, 'mult-1d-by-2d', '×', a, b, a * b, 'questions.multiply');
}

function exerciseDivWithRemainder(ctx: Ctx): Exercise {
  const b = pickInt(ctx.rand, 3, 9);
  const q = pickInt(ctx.rand, 3, 12);
  const r = pickInt(ctx.rand, 1, b - 1);
  const a = b * q + r;
  // Show as integer division → quotient is the answer; remainder lives in meta.
  return {
    ...arithmeticGeneric(ctx, 'div-with-remainder', '÷', a, b, q, 'questions.divideWithRemainder'),
    meta: { a, b, q, r, op: '÷', expression: `${a} ÷ ${b}` },
  };
}

function exerciseAdd3digit(ctx: Ctx): Exercise {
  const a = pickInt(ctx.rand, 100, 700);
  const b = pickInt(ctx.rand, 100, 999 - a);
  return arithmeticGeneric(ctx, 'add-3digit', '+', a, b, a + b, 'questions.addUp');
}

function exerciseSub3digit(ctx: Ctx): Exercise {
  const a = pickInt(ctx.rand, 200, 999);
  const b = pickInt(ctx.rand, 100, a - 1);
  return arithmeticGeneric(ctx, 'sub-3digit', '-', a, b, a - b, 'questions.subtract');
}

function exerciseMixedReview2Digit(ctx: Ctx): Exercise {
  const pool: ExerciseTypeKey[] = [
    'tap-number-2digit',
    'count-tens',
    'place-value-2digit',
    'compare-2digit',
    'skip-counting',
  ];
  const pick = pool[pickInt(ctx.rand, 0, pool.length - 1)]!;
  return generators[pick](ctx);
}

function exerciseMixedReview3Digit(ctx: Ctx): Exercise {
  const pool: ExerciseTypeKey[] = [
    'tap-number-3digit',
    'place-value-3digit',
    'compare-3digit',
    'skip-counting',
  ];
  const pick = pool[pickInt(ctx.rand, 0, pool.length - 1)]!;
  return generators[pick](ctx);
}

function exerciseMixedReviewOpsMedium(ctx: Ctx): Exercise {
  const pool: ExerciseTypeKey[] = [
    'add-numeric',
    'sub-numeric',
    'add-2digit-no-carry',
    'sub-2digit-no-regroup',
    'mult-small',
    'div-small',
  ];
  const pick = pool[pickInt(ctx.rand, 0, pool.length - 1)]!;
  return generators[pick](ctx);
}

function exerciseMixedReviewOpsHard(ctx: Ctx): Exercise {
  const pool: ExerciseTypeKey[] = [
    'add-2digit-carry',
    'sub-2digit-regroup',
    'mult-1d-by-2d',
    'div-with-remainder',
    'add-3digit',
    'sub-3digit',
  ];
  const pick = pool[pickInt(ctx.rand, 0, pool.length - 1)]!;
  return generators[pick](ctx);
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
  // Medium / Hard tier:
  'tap-number-2digit': exerciseTapNumber2Digit,
  'tap-number-3digit': exerciseTapNumber3Digit,
  'count-tens': exerciseCountTens,
  'place-value-2digit': exercisePlaceValue2Digit,
  'place-value-3digit': exercisePlaceValue3Digit,
  'compare-2digit': exerciseCompare2Digit,
  'compare-3digit': exerciseCompare3Digit,
  'skip-counting': exerciseSkipCounting,
  'mixed-review-2digit': exerciseMixedReview2Digit,
  'mixed-review-3digit': exerciseMixedReview3Digit,
  'add-numeric': exerciseAddNumeric,
  'sub-numeric': exerciseSubNumeric,
  'add-2digit-no-carry': exerciseAdd2digitNoCarry,
  'sub-2digit-no-regroup': exerciseSub2digitNoRegroup,
  'add-2digit-carry': exerciseAdd2digitCarry,
  'sub-2digit-regroup': exerciseSub2digitRegroup,
  'mult-small': exerciseMultSmall,
  'div-small': exerciseDivSmall,
  'mult-1d-by-2d': exerciseMult1dBy2d,
  'div-with-remainder': exerciseDivWithRemainder,
  'add-3digit': exerciseAdd3digit,
  'sub-3digit': exerciseSub3digit,
  'mixed-review-ops-medium': exerciseMixedReviewOpsMedium,
  'mixed-review-ops-hard': exerciseMixedReviewOpsHard,
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
