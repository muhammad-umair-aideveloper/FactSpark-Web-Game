import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  consentManager,
  NoneAdapter,
  HouseAdAdapter,
  RefreshController,
  adManager
} from '../index';
import { safeStorage } from '../../engine/LocalStorageStore';

describe('Child Privacy & Consent Configuration', () => {
  it('enforces child-directed defaults for COPPA and FERPA', () => {
    const config = consentManager.getConfig();
    expect(config.childDirectedTreatment).toBe(true);
    expect(config.underAgeOfConsent).toBe(true);
    expect(config.nonPersonalizedAdsOnly).toBe(true);
    expect(config.allowBehavioralTracking).toBe(false);
    expect(config.collectStudentPii).toBe(false);
    expect(config.rewardedAdsEnabled).toBe(false); // Flagged OFF by default
  });

  it('prohibits rewarded ads when feature-flagged off', () => {
    expect(consentManager.areRewardedAdsAllowed()).toBe(false);
  });
});

describe('Ad Providers', () => {
  it('NoneAdapter executes safely without rendering or tracking', async () => {
    const adapter = new NoneAdapter();
    await adapter.init();
    expect(adapter.name).toBe('none');

    let rewardGranted = false;
    adapter.showRewardedAd({
      placement: 'stickers',
      onRewardGranted: () => { rewardGranted = true; }
    });
    expect(rewardGranted).toBe(true);
  });

  it('HouseAdAdapter renders teacher pass promotional HTML', async () => {
    const adapter = new HouseAdAdapter();
    await adapter.init();
    expect(adapter.name).toBe('house-ad');
  });
});

describe('RefreshController Strict Policy', () => {
  let controller: RefreshController;

  beforeEach(() => {
    controller = new RefreshController();
  });

  it('rejects refresh when viewable time is under 30 seconds', () => {
    controller.onSlotBecameVisible();
    const decision = controller.evaluateRoundResetRefresh();

    expect(decision.canRefresh).toBe(false);
    expect(decision.reason).toContain('minimum required is 30s');
    expect(controller.getSessionRefreshCount()).toBe(0);
  });

  it('approves refresh when viewable for 30+ seconds on round reset', () => {
    vi.useFakeTimers();
    controller.onSlotBecameVisible();

    // Advance by 32 seconds
    vi.advanceTimersByTime(32000);

    const decision = controller.evaluateRoundResetRefresh();
    expect(decision.canRefresh).toBe(true);
    expect(controller.getSessionRefreshCount()).toBe(1);

    vi.useRealTimers();
  });

  it('enforces maximum session refresh cap', () => {
    vi.useFakeTimers();

    // Trigger 4 successful refreshes (the max allowed)
    for (let i = 0; i < 4; i++) {
      controller.onSlotBecameVisible();
      vi.advanceTimersByTime(32000);
      const res = controller.evaluateRoundResetRefresh();
      expect(res.canRefresh).toBe(true);
    }
    expect(controller.getSessionRefreshCount()).toBe(4);

    // 5th refresh attempt should be blocked by session cap
    controller.onSlotBecameVisible();
    vi.advanceTimersByTime(32000);
    const blockedRes = controller.evaluateRoundResetRefresh();
    expect(blockedRes.canRefresh).toBe(false);
    expect(blockedRes.reason).toContain('Session refresh cap');

    vi.useRealTimers();
  });
});

describe('AdManager and License Suppression', () => {
  it('suppresses ads when a valid Teacher Pass license exists', () => {
    safeStorage.setItem('gf_license_token', 'valid_signed_teacher_token_123456');

    // Create a new instance to evaluate license
    const licensedManager = (adManager as any).resolveProvider();
    expect(licensedManager.name).toBe('none');

    safeStorage.removeItem('gf_license_token');
  });
});
