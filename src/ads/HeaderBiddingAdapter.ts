import type { AdProvider, AdSlotConfig, RewardedAdOptions } from './types';
import { consentManager } from './ConsentConfig';

declare global {
  interface Window {
    googletag?: any;
    ramp?: any;
  }
}

export class HeaderBiddingAdapter implements AdProvider {
  public readonly name = 'header-bidding';
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return;

    const config = consentManager.getConfig();

    // Prepare Google Publisher Tag / Header Bidding configuration with child-directed settings
    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(() => {
      // COPPA & GDPR-K Compliance Flags
      if (config.childDirectedTreatment) {
        window.googletag.pubads().setPrivacySettings({
          childDirectedTreatment: true,
          underAgeOfConsent: true,
          restrictDataProcessing: true
        });
      }

      if (config.nonPersonalizedAdsOnly) {
        window.googletag.pubads().setRequestNonPersonalizedAds(1);
      }

      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().collapseEmptyDivs(true);
      window.googletag.enableServices();
    });

    this.initialized = true;
  }

  renderSlot(container: HTMLElement, config: AdSlotConfig): void {
    if (typeof window === 'undefined') return;

    // Apply strict min-height and width to prevent Cumulative Layout Shift (CLS < 0.05)
    container.style.minHeight = `${config.minHeight}px`;
    container.style.width = '100%';
    container.style.maxWidth = `${config.width}px`;
    container.style.margin = '0 auto';

    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(() => {
      const slot = window.googletag
        .defineSlot(`/1234567/gridfluency/${config.format}`, [config.width, config.height], config.slotId)
        .addService(window.googletag.pubads());

      window.googletag.display(config.slotId);
    });
  }

  refreshSlot(slotId: string): void {
    if (typeof window === 'undefined' || !window.googletag?.pubads) return;
    window.googletag.cmd.push(() => {
      window.googletag.pubads().refresh();
    });
  }

  showRewardedAd(options: RewardedAdOptions): void {
    if (!consentManager.areRewardedAdsAllowed()) {
      options.onError?.('Rewarded ads are feature-flagged off for student privacy.');
      return;
    }
    // Stub implementation for rewarded placements
    options.onRewardGranted();
  }

  destroy(): void {
    if (typeof window !== 'undefined' && window.googletag?.destroySlots) {
      window.googletag.cmd.push(() => {
        window.googletag.destroySlots();
      });
    }
  }
}
