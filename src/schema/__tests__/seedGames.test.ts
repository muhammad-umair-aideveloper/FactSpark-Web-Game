import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { GameDataSchema, validateGameTargets, type GameData } from '../gameSchema';

describe('Seed Game Files Validation', () => {
  const gamesDir = path.resolve(process.cwd(), 'content/games');
  const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith('.json'));

  it('contains at least 6 game modes in content/games', () => {
    expect(files.length).toBeGreaterThanOrEqual(6);
  });

  files.forEach((file) => {
    it(`validates ${file} against GameDataSchema and target count bounds (1..40)`, () => {
      const fullPath = path.join(gamesDir, file);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const json = JSON.parse(raw);

      // Validate schema
      const parseResult = GameDataSchema.safeParse(json);
      if (!parseResult.success) {
        console.error(`Validation error in ${file}:`, parseResult.error.format());
      }
      expect(parseResult.success).toBe(true);

      const gameData = json as GameData;

      // Validate targets between 1 and 40
      const targetCheck = validateGameTargets(gameData);
      expect(targetCheck.valid, `${file}: ${targetCheck.error}`).toBe(true);
      expect(targetCheck.count).toBeGreaterThanOrEqual(1);
      expect(targetCheck.count).toBeLessThanOrEqual(40);
    });
  });
});
