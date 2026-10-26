export type GameStatus = 'idle' | 'playing' | 'completed' | 'timeout';

export interface TileState {
  id: string;
  value: number | string;
  display: string;
  isTarget: boolean;
  status: 'unclicked' | 'correct' | 'wrong';
  missed?: boolean;
}

export interface PersonalBestRecord {
  stars: number;
  accuracy: number;
  timeSpent: number;
  date: string;
}

export interface GameStats {
  score: number;
  accuracy: number;
  mistakes: number;
  totalClicks: number;
  correctClicks: number;
  remainingTargets: number;
  totalTargets: number;
  timeRemaining: number;
  timeElapsed: number;
  stars: number;
  isPersonalBest: boolean;
  personalBest: PersonalBestRecord | null;
}

export interface GameEngineOptions {
  slug: string;
  prompt: string;
  seconds: number;
  items: Array<{ id: string; value: number | string; display: string }>;
  targetIds: string[];
  allowShuffle?: boolean;
  soundEnabled?: boolean;
  onTick?: (timeRemaining: number, stats: GameStats) => void;
  onTileUpdate?: (tile: TileState) => void;
  onStateChange?: (status: GameStatus, stats: GameStats) => void;
  onGameEnd?: (status: 'completed' | 'timeout', stats: GameStats) => void;
}
