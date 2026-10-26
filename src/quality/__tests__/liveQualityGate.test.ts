import { describe, it, expect } from 'vitest';
import { getAllGames } from '../../contentLoader';
import { auditGameCollection } from '../qualityGate';

describe('Live 40 Seed Games Quality Gate Audit', () => {
  const games = getAllGames();

  it('contains exactly 40 validated seed games', () => {
    expect(games.length).toBe(40);
  });

  it('passes strict SEO quality gate: 250+ words, <70% similarity, 1..40 targets', () => {
    const audit = auditGameCollection(games, { minWords: 250, maxSimilarity: 0.70 });

    if (!audit.passed) {
      console.error('Quality gate failures:');
      for (const [slug, report] of audit.reports.entries()) {
        if (!report.passedQualityGate) {
          console.error(`- ${slug}:`, report.issues);
        }
      }
    }

    expect(audit.passed, `Critical errors: ${audit.criticalErrors.join(', ')}`).toBe(true);
    expect(audit.passedCount).toBe(40);
    expect(audit.failedCount).toBe(0);
  });
});
