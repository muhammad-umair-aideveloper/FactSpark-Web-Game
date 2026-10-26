import { describe, it, expect } from 'vitest';
import { calculateJaccardSimilarity, countWords } from '../textSimilarity';
import { auditGameCollection, type GameQualityReport } from '../qualityGate';
import type { GameData } from '../../schema/gameSchema';

describe('Text Similarity and Word Count', () => {
  it('accurately counts words ignoring punctuation', () => {
    const text = 'Hello world! This is a test, with 123 numbers.';
    expect(countWords(text)).toBe(9);
  });

  it('calculates 1.0 Jaccard similarity for identical texts', () => {
    const text = 'Multiplication fluency relies on identifying skip-counting sequences.';
    expect(calculateJaccardSimilarity(text, text)).toBe(1.0);
  });

  it('calculates low similarity for unrelated math texts', () => {
    const textA = 'Prime numbers are fundamental arithmetic building blocks with exactly two distinct divisors.';
    const textB = 'Fractions represent portions of whole quantities utilizing numerators and denominators.';
    const sim = calculateJaccardSimilarity(textA, textB);
    expect(sim).toBeLessThan(0.2);
  });
});

describe('Quality Gate Audit', () => {
  const baseGame: GameData = {
    slug: 'game-a',
    grade: 4,
    topic: 'number-theory',
    standards: ['CCSS.MATH.CONTENT.4.OA.B.4'],
    seo: {
      title: 'Game A Title for Math Testing',
      metaDescription: 'Description for game A testing math fluency on a grid for classroom Chromebooks.',
      h1: 'Game A Math Testing Grid',
      intro: new Array(150).fill('introductory math concept exploration and reasoning').join(' '),
      howToPlay: new Array(40).fill('click the matching tiles quickly').join(' '),
      teacherNotes: new Array(40).fill('review factor pairs with students').join(' '),
      faq: [
        { q: 'What is this game?', a: 'This is a test game designed for quality gate validation tests.' },
        { q: 'How to play?', a: 'Click tiles on the 10x10 grid before time expires.' }
      ],
      related: ['game-b', 'game-c']
    },
    game: {
      prompt: 'Click primes',
      seconds: 45,
      pool: { type: 'range', from: 1, to: 100 },
      display: 'decimal',
      rule: { name: 'prime', params: {} }
    }
  };

  it('passes game collection when word count and uniqueness criteria are met', () => {
    const gameA: GameData = { ...baseGame, slug: 'game-a' };
    const gameB: GameData = {
      ...baseGame,
      slug: 'game-b',
      seo: {
        ...baseGame.seo,
        title: 'Distinct Game B Geometry and Angles Title',
        metaDescription: 'Completely different description focusing on geometric angles and polygons.',
        h1: 'Game B Polygon Analysis',
        intro: new Array(150).fill('triangles quadrilaterals pentagons hexagons polygons geometric shapes').join(' '),
        howToPlay: new Array(40).fill('identify angles acute obtuse right angles vertices').join(' '),
        teacherNotes: new Array(40).fill('protractor measurement classroom instruction').join(' ')
      }
    };

    const audit = auditGameCollection([gameA, gameB], { minWords: 200, maxSimilarity: 0.7 });
    expect(audit.passed).toBe(true);
    expect(audit.passedCount).toBe(2);
    expect(audit.failedCount).toBe(0);
  });

  it('flags pages with thin content and suggests noindex', () => {
    const thinGame: GameData = {
      ...baseGame,
      slug: 'thin-game',
      seo: {
        ...baseGame.seo,
        intro: 'Short intro.',
        howToPlay: 'Click tiles.',
        teacherNotes: 'Play in class.'
      }
    };

    const audit = auditGameCollection([thinGame], { minWords: 250 });
    expect(audit.passed).toBe(false);
    const report = audit.reports.get('thin-game');
    expect(report?.passedWordCount).toBe(false);
    expect(report?.suggestedRobotsDirective).toBe('noindex, follow');
  });

  it('flags near-duplicate pages exceeding 70% similarity', () => {
    const game1: GameData = { ...baseGame, slug: 'clone-1' };
    const game2: GameData = {
      ...baseGame,
      slug: 'clone-2',
      seo: {
        ...baseGame.seo,
        title: 'Clone 2 Title for Math Testing'
      }
    };

    const audit = auditGameCollection([game1, game2], { minWords: 200, maxSimilarity: 0.70 });
    expect(audit.passed).toBe(false);
    const report1 = audit.reports.get('clone-1');
    const report2 = audit.reports.get('clone-2');
    expect(report1?.passedSimilarity).toBe(false);
    expect(report2?.passedSimilarity).toBe(false);
    expect(report1?.suggestedRobotsDirective).toBe('noindex, follow');
  });
});
