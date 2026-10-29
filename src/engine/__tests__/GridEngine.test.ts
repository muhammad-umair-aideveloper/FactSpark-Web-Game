import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GridEngine } from '../GridEngine';
import type { GameEngineOptions } from '../types';

describe('GridEngine', () => {
  let sampleOptions: GameEngineOptions;

  beforeEach(() => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: `cell-${i + 1}`,
      value: i + 1,
      display: String(i + 1)
    }));

    sampleOptions = {
      slug: 'multiples-of-10-test',
      prompt: 'Click multiples of 10',
      seconds: 30,
      items,
      targetIds: ['cell-10', 'cell-20', 'cell-30', 'cell-40'],
      soundEnabled: false
    };
  });

  it('initializes 100 tiles with correct target flags', () => {
    const engine = new GridEngine(sampleOptions);
    expect(engine.tiles.length).toBe(100);
    expect(engine.targetIds.size).toBe(4);
    expect(engine.status).toBe('idle');
    expect(engine.getRemainingTargetsCount()).toBe(4);

    const targetTile = engine.tiles.find((t) => t.id === 'cell-10');
    expect(targetTile?.isTarget).toBe(true);

    const nonTargetTile = engine.tiles.find((t) => t.id === 'cell-5');
    expect(nonTargetTile?.isTarget).toBe(false);
  });

  it('processes correct clicks and updates targets', () => {
    const engine = new GridEngine(sampleOptions);
    engine.start();

    const res = engine.clickTile('cell-10');
    expect(res?.correct).toBe(true);
    expect(res?.remaining).toBe(3);

    const tile = engine.tiles.find((t) => t.id === 'cell-10');
    expect(tile?.status).toBe('correct');

    const stats = engine.getStats();
    expect(stats.correctClicks).toBe(1);
    expect(stats.mistakes).toBe(0);
    expect(stats.accuracy).toBe(100);

    engine.destroy();
  });

  it('processes wrong clicks with penalty and does not lock the tile', () => {
    vi.useFakeTimers();
    const engine = new GridEngine(sampleOptions);
    engine.start();

    const initialTimeRemaining = engine.getStats().timeRemaining;
    const res = engine.clickTile('cell-5');
    expect(res?.correct).toBe(false);

    const tile = engine.tiles.find((t) => t.id === 'cell-5');
    expect(tile?.status).toBe('wrong');

    const stats = engine.getStats();
    expect(stats.mistakes).toBe(1);
    // 2-second penalty immediately applied
    expect(stats.timeRemaining).toBeLessThanOrEqual(initialTimeRemaining - 2);

    // Fast forward 700ms - tile should be unlocked (status 'unclicked')
    vi.advanceTimersByTime(700);
    expect(tile?.status).toBe('unclicked');

    engine.destroy();
    vi.useRealTimers();
  });

  it('completes round with 3 stars when 0 mistakes', () => {
    const engine = new GridEngine(sampleOptions);
    engine.start();

    engine.clickTile('cell-10');
    engine.clickTile('cell-20');
    engine.clickTile('cell-30');
    engine.clickTile('cell-40');

    expect(engine.status).toBe('completed');
    const stats = engine.getStats();
    expect(stats.stars).toBe(3);
    expect(stats.mistakes).toBe(0);
    expect(stats.remainingTargets).toBe(0);

    engine.destroy();
  });

  it('awards 2 stars for 1-2 mistakes and 1 star for 3+ mistakes', () => {
    const engine = new GridEngine(sampleOptions);
    engine.start();

    // 1 mistake
    engine.clickTile('cell-1');
    engine.clickTile('cell-10');
    engine.clickTile('cell-20');
    engine.clickTile('cell-30');
    engine.clickTile('cell-40');

    expect(engine.status).toBe('completed');
    expect(engine.getStats().stars).toBe(2);

    // Reset and test 3 mistakes
    engine.reset();
    engine.start();
    engine.clickTile('cell-1');
    engine.clickTile('cell-2');
    engine.clickTile('cell-3');
    engine.clickTile('cell-10');
    engine.clickTile('cell-20');
    engine.clickTile('cell-30');
    engine.clickTile('cell-40');

    expect(engine.status).toBe('completed');
    expect(engine.getStats().stars).toBe(1);

    engine.destroy();
  });

  it('marks missed targets on timeout', () => {
    vi.useFakeTimers();
    const shortGameOptions = { ...sampleOptions, seconds: 2 };
    const engine = new GridEngine(shortGameOptions);
    engine.start();

    // Click 1 target
    engine.clickTile('cell-10');

    // Advance 3 seconds past the 2 second limit
    vi.advanceTimersByTime(3000);

    expect(engine.status).toBe('timeout');
    const missedTargets = engine.tiles.filter((t) => t.missed);
    expect(missedTargets.length).toBe(3); // 3 remaining targets marked as missed

    engine.destroy();
    vi.useRealTimers();
  });

  it('ignores clicks on a wrong tile while it is flashing to prevent penalty stacking', () => {
    vi.useFakeTimers();
    const engine = new GridEngine(sampleOptions);
    engine.start();

    // First wrong click
    engine.clickTile('cell-5');
    const tile = engine.tiles.find((t) => t.id === 'cell-5');
    expect(tile?.status).toBe('wrong');
    expect(engine.getStats().mistakes).toBe(1);
    expect(engine.getStats().totalClicks).toBe(1);

    // Rapid spam clicks on the same flashing wrong tile
    engine.clickTile('cell-5');
    engine.clickTile('cell-5');
    engine.clickTile('cell-5');

    // Mistakes and totalClicks must not stack
    expect(engine.getStats().mistakes).toBe(1);
    expect(engine.getStats().totalClicks).toBe(1);

    // Advance 700ms past the 600ms flash
    vi.advanceTimersByTime(700);
    expect(tile?.status).toBe('unclicked');

    // Now clicking again is recognized as a new mistake
    engine.clickTile('cell-5');
    expect(engine.getStats().mistakes).toBe(2);
    expect(engine.getStats().totalClicks).toBe(2);

    engine.destroy();
    vi.useRealTimers();
  });

  it('reports 0% accuracy when zero clicks have occurred', () => {
    const engine = new GridEngine(sampleOptions);
    expect(engine.getStats().totalClicks).toBe(0);
    expect(engine.getStats().accuracy).toBe(0);

    // Also on timeout with zero clicks
    vi.useFakeTimers();
    const shortGame = new GridEngine({ ...sampleOptions, seconds: 1 });
    shortGame.start();
    vi.advanceTimersByTime(1500);
    expect(shortGame.status).toBe('timeout');
    expect(shortGame.getStats().totalClicks).toBe(0);
    expect(shortGame.getStats().accuracy).toBe(0);

    shortGame.destroy();
    engine.destroy();
    vi.useRealTimers();
  });
});
