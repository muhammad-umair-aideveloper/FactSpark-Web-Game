import type { GameData } from '../schema/gameSchema';
import { validateGameTargets } from '../schema/gameSchema';
import { countWords, calculateJaccardSimilarity } from './textSimilarity';

export interface GameQualityReport {
  slug: string;
  wordCount: number;
  targetCount: number;
  highestSimilarityWith?: string;
  highestSimilarityScore: number;
  passedWordCount: boolean;
  passedSimilarity: boolean;
  passedTargets: boolean;
  passedQualityGate: boolean;
  suggestedRobotsDirective: 'index, follow' | 'noindex, follow';
  issues: string[];
}

export interface CollectionAuditResult {
  passed: boolean;
  totalGames: number;
  passedCount: number;
  failedCount: number;
  reports: Map<string, GameQualityReport>;
  criticalErrors: string[];
}

export function extractAggregatedText(game: GameData): string {
  const faqText = game.seo.faq.map((f) => `${f.q} ${f.a}`).join(' ');
  return `${game.seo.title} ${game.seo.intro} ${game.seo.howToPlay} ${game.seo.teacherNotes} ${faqText}`;
}

export function auditGameCollection(
  games: GameData[],
  options: { minWords?: number; maxSimilarity?: number } = {}
): CollectionAuditResult {
  const minWords = options.minWords ?? 250;
  const maxSimilarity = options.maxSimilarity ?? 0.70;

  const reports = new Map<string, GameQualityReport>();
  const gameTexts = new Map<string, string>();
  const criticalErrors: string[] = [];

  // Step 1: Word counts & Target bounds
  for (const game of games) {
    const text = extractAggregatedText(game);
    gameTexts.set(game.slug, text);

    const wordCount = countWords(text);
    const targetCheck = validateGameTargets(game);

    const issues: string[] = [];
    const passedWordCount = wordCount >= minWords;
    if (!passedWordCount) {
      issues.push(`Word count ${wordCount} is below minimum requirement of ${minWords} words`);
    }

    const passedTargets = targetCheck.valid;
    if (!passedTargets) {
      issues.push(targetCheck.error ?? 'Invalid target count');
    }

    reports.set(game.slug, {
      slug: game.slug,
      wordCount,
      targetCount: targetCheck.count,
      highestSimilarityScore: 0,
      passedWordCount,
      passedSimilarity: true,
      passedTargets,
      passedQualityGate: false,
      suggestedRobotsDirective: 'index, follow',
      issues
    });
  }

  // Step 2: Cross-game pairwise similarity check
  for (let i = 0; i < games.length; i++) {
    const slugA = games[i].slug;
    const textA = gameTexts.get(slugA)!;
    const reportA = reports.get(slugA)!;

    for (let j = i + 1; j < games.length; j++) {
      const slugB = games[j].slug;
      const textB = gameTexts.get(slugB)!;
      const reportB = reports.get(slugB)!;

      const sim = calculateJaccardSimilarity(textA, textB, 3);

      if (sim > reportA.highestSimilarityScore) {
        reportA.highestSimilarityScore = Math.round(sim * 1000) / 1000;
        reportA.highestSimilarityWith = slugB;
      }
      if (sim > reportB.highestSimilarityScore) {
        reportB.highestSimilarityScore = Math.round(sim * 1000) / 1000;
        reportB.highestSimilarityWith = slugA;
      }

      if (sim > maxSimilarity) {
        const errorMsg = `Similarity between "${slugA}" and "${slugB}" is ${(sim * 100).toFixed(1)}%, exceeding limit of ${(maxSimilarity * 100).toFixed(0)}%`;
        criticalErrors.push(errorMsg);
        reportA.issues.push(errorMsg);
        reportB.issues.push(errorMsg);
        reportA.passedSimilarity = false;
        reportB.passedSimilarity = false;
      }
    }
  }

  // Step 3: Determine final quality gate status and robots directive
  let passedCount = 0;
  for (const report of reports.values()) {
    report.passedQualityGate = report.passedWordCount && report.passedSimilarity && report.passedTargets;
    if (report.passedQualityGate) {
      report.suggestedRobotsDirective = 'index, follow';
      passedCount++;
    } else {
      report.suggestedRobotsDirective = 'noindex, follow';
    }
  }

  return {
    passed: passedCount === games.length && criticalErrors.length === 0,
    totalGames: games.length,
    passedCount,
    failedCount: games.length - passedCount,
    reports,
    criticalErrors
  };
}
