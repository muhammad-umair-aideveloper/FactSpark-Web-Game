import type {
  GameStatus,
  TileState,
  GameStats,
  GameEngineOptions,
  PersonalBestRecord
} from './types';
import { safeStorage } from './LocalStorageStore';
import { audioEffects } from './AudioEffects';

export class GridEngine {
  public status: GameStatus = 'idle';
  public tiles: TileState[] = [];
  public targetIds: Set<string> = new Set();
  public foundTargetIds: Set<string> = new Set();

  private options: GameEngineOptions;
  private mistakes = 0;
  private totalClicks = 0;
  private correctClicks = 0;
  private timeLimitSeconds: number;
  private penaltySeconds = 0;
  private startTime = 0;
  private timerHandle: any = null;
  private personalBest: PersonalBestRecord | null = null;
  private isNewPersonalBest = false;

  constructor(options: GameEngineOptions) {
    this.options = options;
    this.timeLimitSeconds = options.seconds;
    this.personalBest = safeStorage.getPersonalBest(options.slug);
    if (options.soundEnabled !== undefined) {
      audioEffects.enabled = options.soundEnabled;
    }
    this.initializeTiles();
  }

  private initializeTiles(): void {
    this.targetIds = new Set(this.options.targetIds);
    this.foundTargetIds.clear();

    const rawItems = [...this.options.items];
    if (this.options.allowShuffle) {
      // Shuffle items for hard mode / variation if requested
      // Default initial layout is ordered 1..100
    }

    this.tiles = rawItems.map((item) => ({
      id: item.id,
      value: item.value,
      display: item.display,
      isTarget: this.targetIds.has(item.id),
      status: 'unclicked',
      missed: false
    }));
  }

  public shuffleTiles(): void {
    if (this.status === 'playing') return;
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
    this.options.onStateChange?.(this.status, this.getStats());
  }

  public resetTilesToOrder(): void {
    if (this.status === 'playing') return;
    this.initializeTiles();
    this.options.onStateChange?.(this.status, this.getStats());
  }

  public start(): void {
    if (this.status === 'playing') return;
    this.status = 'playing';
    this.mistakes = 0;
    this.totalClicks = 0;
    this.correctClicks = 0;
    this.penaltySeconds = 0;
    this.foundTargetIds.clear();
    this.isNewPersonalBest = false;

    // Reset tile visual states
    this.tiles.forEach((t) => {
      t.status = 'unclicked';
      t.missed = false;
    });

    this.startTime = Date.now();
    this.startTimer();
    this.options.onStateChange?.(this.status, this.getStats());
  }

  private startTimer(): void {
    this.stopTimer();
    const intervalMs = 100;

    this.timerHandle = setInterval(() => {
      if (this.status !== 'playing') {
        this.stopTimer();
        return;
      }

      const now = Date.now();
      const elapsedWallClock = (now - this.startTime) / 1000;
      const totalElapsed = elapsedWallClock + this.penaltySeconds;
      const remaining = Math.max(0, this.timeLimitSeconds - totalElapsed);

      this.options.onTick?.(remaining, this.getStats());

      if (remaining <= 0) {
        this.handleTimeout();
      }
    }, intervalMs);
  }

  private stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  public clickTile(id: string): { correct: boolean; remaining: number } | null {
    if (this.status === 'idle') {
      this.start();
    }
    if (this.status !== 'playing') return null;

    const tile = this.tiles.find((t) => t.id === id);
    if (!tile) return null;

    // If already clicked correctly, ignore
    if (tile.status === 'correct') {
      return { correct: true, remaining: this.getRemainingTargetsCount() };
    }

    this.totalClicks++;

    if (tile.isTarget) {
      // Correct click
      tile.status = 'correct';
      this.correctClicks++;
      this.foundTargetIds.add(tile.id);
      audioEffects.playCorrect();
      this.options.onTileUpdate?.(tile);

      // Check if all targets found
      if (this.foundTargetIds.size >= this.targetIds.size) {
        this.handleComplete();
      }

      return { correct: true, remaining: this.getRemainingTargetsCount() };
    } else {
      // Wrong click:
      // - flashes red with X icon
      // - costs 2 seconds
      // - is NOT locked (stays clickable/interactive)
      tile.status = 'wrong';
      this.mistakes++;
      this.penaltySeconds += 2; // Immediate 2s penalty
      audioEffects.playWrong();
      this.options.onTileUpdate?.(tile);

      // Revert status to unclicked after 600ms flash so tile is NOT locked
      setTimeout(() => {
        if (tile.status === 'wrong') {
          tile.status = 'unclicked';
          this.options.onTileUpdate?.(tile);
        }
      }, 600);

      // Check if penalty caused timeout
      const stats = this.getStats();
      if (stats.timeRemaining <= 0) {
        this.handleTimeout();
      }

      return { correct: false, remaining: this.getRemainingTargetsCount() };
    }
  }

  private handleComplete(): void {
    this.stopTimer();
    this.status = 'completed';
    audioEffects.playComplete();

    const stats = this.getStats();
    const pbRecord: PersonalBestRecord = {
      stars: stats.stars,
      accuracy: stats.accuracy,
      timeSpent: Math.round(stats.timeElapsed * 10) / 10,
      date: new Date().toISOString()
    };

    this.isNewPersonalBest = safeStorage.savePersonalBest(this.options.slug, pbRecord);
    this.personalBest = safeStorage.getPersonalBest(this.options.slug);

    this.options.onStateChange?.(this.status, this.getStats());
    this.options.onGameEnd?.('completed', this.getStats());
  }

  private handleTimeout(): void {
    this.stopTimer();
    this.status = 'timeout';

    // Reveal missed tiles with outline
    this.tiles.forEach((t) => {
      if (t.isTarget && t.status !== 'correct') {
        t.missed = true;
        this.options.onTileUpdate?.(t);
      }
    });

    this.options.onStateChange?.(this.status, this.getStats());
    this.options.onGameEnd?.('timeout', this.getStats());
  }

  public reset(): void {
    this.stopTimer();
    this.status = 'idle';
    this.mistakes = 0;
    this.totalClicks = 0;
    this.correctClicks = 0;
    this.penaltySeconds = 0;
    this.foundTargetIds.clear();
    this.isNewPersonalBest = false;

    this.tiles.forEach((t) => {
      t.status = 'unclicked';
      t.missed = false;
    });

    this.options.onStateChange?.(this.status, this.getStats());
  }

  public getRemainingTargetsCount(): number {
    return Math.max(0, this.targetIds.size - this.foundTargetIds.size);
  }

  public calculateStars(): number {
    if (this.status !== 'completed') return 0;
    if (this.mistakes === 0) return 3;
    if (this.mistakes <= 2) return 2;
    return 1;
  }

  public getStats(): GameStats {
    const now = Date.now();
    const elapsedWallClock = this.status === 'idle' ? 0 : (now - this.startTime) / 1000;
    const totalElapsed = elapsedWallClock + this.penaltySeconds;
    const timeRemaining = this.status === 'idle'
      ? this.timeLimitSeconds
      : Math.max(0, this.timeLimitSeconds - totalElapsed);

    const accuracy = this.totalClicks === 0
      ? 100
      : Math.round((this.correctClicks / this.totalClicks) * 100);

    const score = Math.max(
      0,
      this.foundTargetIds.size * 100 - this.mistakes * 25 + Math.round(timeRemaining * 10)
    );

    return {
      score,
      accuracy,
      mistakes: this.mistakes,
      totalClicks: this.totalClicks,
      correctClicks: this.correctClicks,
      remainingTargets: this.getRemainingTargetsCount(),
      totalTargets: this.targetIds.size,
      timeRemaining: Math.round(timeRemaining * 10) / 10,
      timeElapsed: Math.min(this.timeLimitSeconds, Math.round(totalElapsed * 10) / 10),
      stars: this.calculateStars(),
      isPersonalBest: this.isNewPersonalBest,
      personalBest: this.personalBest
    };
  }

  public destroy(): void {
    this.stopTimer();
  }
}
