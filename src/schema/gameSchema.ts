import { z } from 'zod';
import { ruleRegistry, evaluateItem } from '../rules';
import type { CellItem } from '../rules/types';

export const DisplayFormatSchema = z.enum([
  'decimal',
  'roman',
  'fraction',
  'words'
]);

export const RuleConfigSchema = z.object({
  name: z.string(),
  params: z.record(z.any()).default({})
});

export const CellItemSchema = z.object({
  id: z.string(),
  value: z.union([z.number(), z.string()]),
  display: z.string(),
  isTarget: z.boolean().optional()
});

export const PoolConfigSchema = z.object({
  type: z.enum(['range', 'explicit']),
  from: z.number().int().optional(),
  to: z.number().int().optional(),
  items: z.array(CellItemSchema).optional()
}).superRefine((data, ctx) => {
  if (data.type === 'range') {
    if (data.from === undefined || data.to === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Range pool must have both "from" and "to" properties'
      });
    } else if (data.from >= data.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '"from" must be strictly less than "to"'
      });
    }
  } else if (data.type === 'explicit') {
    if (!Array.isArray(data.items) || data.items.length !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Explicit pool must contain exactly 100 items (found ${data.items ? data.items.length : 0})`
      });
    }
  }
});

export const FaqItemSchema = z.object({
  q: z.string().min(5, 'FAQ question must be at least 5 characters'),
  a: z.string().min(10, 'FAQ answer must be at least 10 characters')
});

export const GameDataSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case'),
  grade: z.number().int().min(1).max(8),
  topic: z.enum([
    'number-theory',
    'operations',
    'fractions',
    'decimals',
    'place-value',
    'algebra-foundations'
  ]),
  standards: z.array(z.string().min(2)).min(1),
  seo: z.object({
    title: z.string().min(15).max(80),
    metaDescription: z.string().min(70).max(170),
    h1: z.string().min(10).max(90),
    intro: z.string().min(100, 'Intro should have comprehensive introductory content'),
    howToPlay: z.string().min(30),
    teacherNotes: z.string().min(30),
    faq: z.array(FaqItemSchema).min(2),
    related: z.array(z.string()).min(2).max(6)
  }),
  game: z.object({
    prompt: z.string().min(5).max(90),
    seconds: z.number().int().min(20).max(120),
    pool: PoolConfigSchema,
    display: DisplayFormatSchema.default('decimal'),
    rule: RuleConfigSchema,
    targets: z.array(z.string()).optional(),
    allowShuffle: z.boolean().default(true)
  })
});

export type GameData = z.infer<typeof GameDataSchema>;

/**
 * Generates the full 100-cell item list from either a range or explicit pool.
 */
export function generatePoolItems(pool: z.infer<typeof PoolConfigSchema>, displayFormat = 'decimal'): CellItem[] {
  if (pool.type === 'explicit' && pool.items) {
    return pool.items;
  }
  const from = pool.from ?? 1;
  const to = pool.to ?? 100;
  const items: CellItem[] = [];
  for (let val = from; val <= to; val++) {
    items.push({
      id: `cell-${val}`,
      value: val,
      display: formatDisplay(val, displayFormat)
    });
  }
  return items;
}

function formatDisplay(val: number, format: string): string {
  if (format === 'roman') {
    return toRomanNumeral(val);
  }
  return String(val);
}

function toRomanNumeral(num: number): string {
  if (num < 1 || num > 3999) return String(num);
  const romanMap: [number, string][] = [
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let res = '';
  let n = num;
  for (const [v, s] of romanMap) {
    while (n >= v) {
      res += s;
      n -= v;
    }
  }
  return res;
}

/**
 * Resolves all target item IDs for a game configuration.
 */
export function resolveTargetIds(gameData: GameData): string[] {
  const items = generatePoolItems(gameData.game.pool, gameData.game.display);
  const ruleName = gameData.game.rule.name;
  const params = {
    ...gameData.game.rule.params,
    targets: gameData.game.targets
  };

  const targetIds: string[] = [];
  for (const item of items) {
    if (evaluateItem(ruleName, params, item)) {
      targetIds.push(item.id);
    }
  }
  return targetIds;
}

/**
 * Validates that the game produces between 1 and 40 targets.
 * Fails the check if targets are 0 or > 40.
 */
export function validateGameTargets(gameData: GameData): { valid: boolean; count: number; error?: string } {
  if (!ruleRegistry[gameData.game.rule.name]) {
    return {
      valid: false,
      count: 0,
      error: `Rule "${gameData.game.rule.name}" is not registered in rule registry`
    };
  }

  const targets = resolveTargetIds(gameData);
  if (targets.length === 0) {
    return {
      valid: false,
      count: 0,
      error: `Game "${gameData.slug}" has 0 targets (unsolvable)`
    };
  }
  if (targets.length > 40) {
    return {
      valid: false,
      count: targets.length,
      error: `Game "${gameData.slug}" has ${targets.length} targets (exceeds maximum limit of 40)`
    };
  }
  return { valid: true, count: targets.length };
}
