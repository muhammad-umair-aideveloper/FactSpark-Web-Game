import { getGameBySlug } from '../contentLoader';
import type { GameData } from '../schema/gameSchema';

export interface PlaylistConfig {
  slugs: string[];
  games: GameData[];
  shareUrl: string;
}

/**
 * Encodes an array of game slugs into a playlist query parameter string.
 */
export function encodePlaylist(slugs: string[], baseUrl = 'https://gridfluency.com'): string {
  const cleanSlugs = slugs
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
  const param = cleanSlugs.join(',');
  return `${baseUrl}/playlist?games=${encodeURIComponent(param)}`;
}

/**
 * Decodes a raw query string or comma-separated string into validated game objects.
 */
export function decodePlaylist(rawQuery: string | null | undefined): PlaylistConfig {
  if (!rawQuery) {
    return { slugs: [], games: [], shareUrl: 'https://gridfluency.com/playlist' };
  }

  // Handle either full query string or param value
  const param = rawQuery.includes('games=')
    ? new URLSearchParams(rawQuery.replace(/^[?]/, '')).get('games') ?? ''
    : rawQuery;

  const rawSlugs = decodeURIComponent(param)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  // Validate slugs against loaded content
  const validGames: GameData[] = [];
  const validSlugs: string[] = [];

  for (const slug of rawSlugs) {
    const game = getGameBySlug(slug);
    if (game && !validSlugs.includes(slug)) {
      validGames.push(game);
      validSlugs.push(slug);
    }
  }

  return {
    slugs: validSlugs,
    games: validGames,
    shareUrl: encodePlaylist(validSlugs)
  };
}
