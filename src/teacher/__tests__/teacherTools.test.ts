import { describe, it, expect } from 'vitest';
import { generateQrSvg } from '../qrGenerator';
import { encodePlaylist, decodePlaylist } from '../playlistEncoder';
import { generateWorksheetData } from '../worksheetGenerator';
import { getGameBySlug } from '../../contentLoader';

describe('QR Code SVG Generator', () => {
  it('generates a valid SVG QR code string', () => {
    const url = 'https://gridfluency.com/math/prime-numbers-to-100-game/';
    const svg = generateQrSvg(url, 220);

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 220 220"');
    expect(svg).toContain('width="220"');
    expect(svg).toContain('height="220"');
    expect(svg).toContain('aria-label');
    expect(svg).toContain('</svg>');
  });
});

describe('Classroom Playlist Encoder and Decoder', () => {
  it('encodes slug lists into URL query parameters', () => {
    const slugs = ['prime-numbers-to-100-game', 'multiples-of-3-grid'];
    const url = encodePlaylist(slugs);

    expect(url).toBe('https://gridfluency.com/playlist?games=prime-numbers-to-100-game%2Cmultiples-of-3-grid');
  });

  it('decodes and validates slugs against loaded game catalog', () => {
    const raw = 'games=prime-numbers-to-100-game,multiples-of-3-grid,invalid-slug-123';
    const config = decodePlaylist(raw);

    expect(config.slugs).toEqual(['prime-numbers-to-100-game', 'multiples-of-3-grid']);
    expect(config.games.length).toBe(2);
    expect(config.games[0].slug).toBe('prime-numbers-to-100-game');
  });

  it('handles empty or null playlist gracefully', () => {
    const empty = decodePlaylist(null);
    expect(empty.slugs).toEqual([]);
    expect(empty.games).toEqual([]);
  });
});

describe('Printable Worksheet Data Generator', () => {
  it('generates 100 items with exact target indicators for prime numbers', () => {
    const game = getGameBySlug('prime-numbers-to-100-game');
    expect(game).toBeDefined();

    if (game) {
      const data = generateWorksheetData(game);
      expect(data.items.length).toBe(100);
      expect(data.targetsCount).toBe(25);
      expect(data.targetDisplays.length).toBe(25);
      expect(data.targetDisplays).toContain('2');
      expect(data.targetDisplays).toContain('97');
      expect(data.targetDisplays).not.toContain('4');
    }
  });
});
