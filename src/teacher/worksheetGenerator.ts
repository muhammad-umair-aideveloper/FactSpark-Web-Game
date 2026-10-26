import type { GameData } from '../schema/gameSchema';
import { generatePoolItems, resolveTargetIds } from '../schema/gameSchema';
import type { CellItem } from '../rules/types';

export interface WorksheetData {
  slug: string;
  title: string;
  prompt: string;
  grade: number;
  topic: string;
  standard: string;
  items: Array<CellItem & { isTarget: boolean }>;
  targetsCount: number;
  targetDisplays: string[];
}

export function generateWorksheetData(game: GameData): WorksheetData {
  const poolItems = generatePoolItems(game.game.pool, game.game.display);
  const targetIdSet = new Set(resolveTargetIds(game));

  const items = poolItems.map((item) => ({
    ...item,
    isTarget: targetIdSet.has(item.id)
  }));

  const targetDisplays = items
    .filter((item) => item.isTarget)
    .map((item) => item.display);

  return {
    slug: game.slug,
    title: game.seo.h1,
    prompt: game.game.prompt,
    grade: game.grade,
    topic: game.topic.replace('-', ' '),
    standard: game.standards[0] || '',
    items,
    targetsCount: targetDisplays.length,
    targetDisplays
  };
}
