import type { RefreshDecision } from './types';
import { consentManager } from './ConsentConfig';

export class RefreshController {
  private viewableStartTimestamp: number | null = null;
  private consecutiveViewableSeconds = 0;
  private sessionRefreshCount = 0;
  private observer: IntersectionObserver | null = null;
  private intervalHandle: any = null;
  private isCurrentlyVisible = false;

  constructor(targetElement?: HTMLElement | null) {
    if (targetElement && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.initObserver(targetElement);
    }
  }

  private initObserver(targetElement: HTMLElement): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          this.onSlotBecameVisible();
        } else {
          this.onSlotBecameHidden();
        }
      },
      { threshold: [0.5] }
    );
    this.observer.observe(targetElement);
  }

  public onSlotBecameVisible(): void {
    if (this.isCurrentlyVisible) return;
    this.isCurrentlyVisible = true;
    this.viewableStartTimestamp = Date.now();

    if (!this.intervalHandle) {
      this.intervalHandle = setInterval(() => {
        if (this.isCurrentlyVisible && this.viewableStartTimestamp) {
          this.consecutiveViewableSeconds = (Date.now() - this.viewableStartTimestamp) / 1000;
        }
      }, 500);
    }
  }

  public onSlotBecameHidden(): void {
    this.isCurrentlyVisible = false;
    this.viewableStartTimestamp = null;
    this.consecutiveViewableSeconds = 0;
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  /**
   * Evaluates whether a refresh is permissible during a round reset.
   * STRICT CRITERIA:
   * 1. Must be on round reset.
   * 2. Slot must have been continuously viewable for >= 30 seconds.
   * 3. Must not have exceeded the per-session refresh cap.
   */
  public evaluateRoundResetRefresh(): RefreshDecision {
    const config = consentManager.getConfig();

    // Check session cap
    if (this.sessionRefreshCount >= config.maxRefreshesPerSession) {
      return {
        canRefresh: false,
        reason: `Session refresh cap (${config.maxRefreshesPerSession}) reached.`,
        consecutiveViewableSeconds: this.consecutiveViewableSeconds,
        sessionRefreshCount: this.sessionRefreshCount
      };
    }

    // Check continuous viewability
    if (this.consecutiveViewableSeconds < config.refreshViewabilitySeconds) {
      return {
        canRefresh: false,
        reason: `Slot was viewable for only ${this.consecutiveViewableSeconds.toFixed(1)}s (minimum required is ${config.refreshViewabilitySeconds}s).`,
        consecutiveViewableSeconds: this.consecutiveViewableSeconds,
        sessionRefreshCount: this.sessionRefreshCount
      };
    }

    // Refresh approved!
    this.sessionRefreshCount++;
    // Reset viewability clock after refresh
    this.viewableStartTimestamp = Date.now();
    this.consecutiveViewableSeconds = 0;

    return {
      canRefresh: true,
      consecutiveViewableSeconds: 0,
      sessionRefreshCount: this.sessionRefreshCount
    };
  }

  public getSessionRefreshCount(): number {
    return this.sessionRefreshCount;
  }

  public getConsecutiveViewableSeconds(): number {
    return this.consecutiveViewableSeconds;
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }
}
