import { describe, it, expect } from 'vitest';
import { GameDataSchema, validateGameTargets, type GameData } from '../gameSchema';

describe('GameDataSchema and Target Count Validator', () => {
  const validPrimeGame: GameData = {
    slug: 'prime-numbers-to-100-game',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Prime Numbers to 100 Speed Game - Grid Fluency',
      metaDescription: 'Find every prime number up to 100 in this fast-paced math speed challenge. Built for classroom Chromebooks.',
      h1: 'Prime Numbers to 100 Speed Grid',
      intro: 'Practice finding prime numbers on a 100-tile grid. Students quickly scan and select all primes between 1 and 100 under time pressure.',
      howToPlay: 'Scan the grid for numbers with only two factors. Click each prime before time runs out.',
      teacherNotes: 'Great warm-up activity for 4th and 5th grade number theory units on factors and primes.',
      faq: [
        { q: 'Is 1 a prime number?', a: 'No, 1 has only one positive divisor (itself), so it is neither prime nor composite.' },
        { q: 'What is the smallest prime?', a: '2 is the smallest prime number and the only even prime.' }
      ],
      related: ['multiples-of-3-grid', 'square-numbers-1-to-100']
    },
    game: {
      prompt: 'Click all prime numbers',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'prime', params: {} },
      allowShuffle: true
    }
  };

  it('validates a correct game data object', () => {
    const parseResult = GameDataSchema.safeParse(validPrimeGame);
    expect(parseResult.success).toBe(true);

    const targetCheck = validateGameTargets(validPrimeGame);
    expect(targetCheck.valid).toBe(true);
    expect(targetCheck.count).toBe(25); // Exactly 25 primes between 1 and 100
  });

  it('rejects an invalid slug format', () => {
    const invalid = { ...validPrimeGame, slug: 'Prime_Numbers!' };
    const parseResult = GameDataSchema.safeParse(invalid);
    expect(parseResult.success).toBe(false);
  });

  it('rejects a game with zero targets', () => {
    const zeroTargetGame: GameData = {
      ...validPrimeGame,
      game: {
        ...validPrimeGame.game,
        prompt: 'Click multiples of 1000',
        rule: { name: 'multiple_of', params: { factor: 1000 } }
      }
    };
    const targetCheck = validateGameTargets(zeroTargetGame);
    expect(targetCheck.valid).toBe(false);
    expect(targetCheck.count).toBe(0);
    expect(targetCheck.error).toContain('0 targets');
  });

  it('rejects a game with more than 40 targets', () => {
    // Evens between 1 and 100 has 50 targets (> 40)
    const tooManyTargetsGame: GameData = {
      ...validPrimeGame,
      game: {
        ...validPrimeGame.game,
        prompt: 'Click all even numbers',
        rule: { name: 'even', params: {} }
      }
    };
    const targetCheck = validateGameTargets(tooManyTargetsGame);
    expect(targetCheck.valid).toBe(false);
    expect(targetCheck.count).toBe(50);
    expect(targetCheck.error).toContain('exceeds maximum limit of 40');
  });
});
