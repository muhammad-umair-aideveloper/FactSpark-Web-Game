import * as fs from 'fs';
import * as path from 'path';
import { GameDataSchema, type GameData } from './schema/gameSchema';

let cachedGames: GameData[] | null = null;

export function getAllGames(): GameData[] {
  if (cachedGames) return cachedGames;

  const gamesDir = path.resolve(process.cwd(), 'content/games');
  if (!fs.existsSync(gamesDir)) {
    return [];
  }

  const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith('.json'));
  const games: GameData[] = [];

  for (const file of files) {
    const filePath = path.join(gamesDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      const validated = GameDataSchema.parse(parsed);
      games.push(validated);
    } catch (err: any) {
      console.error(`Failed to load or validate game file "${file}":`, err?.message || err);
    }
  }

  cachedGames = games;
  return games;
}

export function getGameBySlug(slug: string): GameData | undefined {
  return getAllGames().find((g) => g.slug === slug);
}

export function getGamesByGrade(grade: number): GameData[] {
  return getAllGames().filter((g) => g.grade === grade);
}

export function getGamesByTopic(topic: string): GameData[] {
  return getAllGames().filter((g) => g.topic === topic);
}

export function getAllTopics(): string[] {
  const topics = new Set<string>();
  getAllGames().forEach((g) => topics.add(g.topic));
  return Array.from(topics);
}

export function getAllGrades(): number[] {
  const grades = new Set<number>();
  getAllGames().forEach((g) => grades.add(g.grade));
  return Array.from(grades).sort((a, b) => a - b);
}
