/**
 * Normalizes text for similarity and word count analysis.
 */
export function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

/**
 * Counts total words in a text string.
 */
export function countWords(text: string): number {
  return normalizeText(text).length;
}

/**
 * Generates n-grams (shingles) from an array of tokens.
 */
export function generateNgrams(tokens: string[], n = 3): Set<string> {
  const ngrams = new Set<string>();
  if (tokens.length < n) {
    if (tokens.length > 0) {
      ngrams.add(tokens.join(' '));
    }
    return ngrams;
  }
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Computes Jaccard similarity between two text strings using word 3-grams.
 * Returns a value between 0.0 (completely distinct) and 1.0 (identical).
 */
export function calculateJaccardSimilarity(textA: string, textB: string, n = 3): number {
  const tokensA = normalizeText(textA);
  const tokensB = normalizeText(textB);

  if (tokensA.length === 0 && tokensB.length === 0) return 1.0;
  if (tokensA.length === 0 || tokensB.length === 0) return 0.0;

  const ngramsA = generateNgrams(tokensA, n);
  const ngramsB = generateNgrams(tokensB, n);

  let intersectionSize = 0;
  for (const item of ngramsA) {
    if (ngramsB.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = ngramsA.size + ngramsB.size - intersectionSize;
  if (unionSize === 0) return 0.0;

  return intersectionSize / unionSize;
}
