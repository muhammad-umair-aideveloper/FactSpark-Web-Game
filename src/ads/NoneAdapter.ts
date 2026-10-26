import type { AdProvider, AdSlotConfig, RewardedAdOptions } from './types';

export class NoneAdapter implements AdProvider {
  public readonly name = 'none';

  async init(): Promise<void> {
    // No-op
  }

  renderSlot(container: HTMLElement, config: AdSlotConfig): void {
    // Zero ads rendered; collapse container if necessary
    container.style.display = 'none';
  }

  refreshSlot(_slotId: string): void {
    // No-op
  }

  showRewardedAd(options: RewardedAdOptions): void {
    // Automatically grant cosmetic reward for licensed pass users without showing ads
    options.onRewardGranted();
  }

  destroy(): void {
    // No-op
  }
}
