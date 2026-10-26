import type { AdProvider, AdSlotConfig } from './types';
import { NoneAdapter } from './NoneAdapter';
import { HouseAdAdapter } from './HouseAdAdapter';
import { HeaderBiddingAdapter } from './HeaderBiddingAdapter';
import { RefreshController } from './RefreshController';
import { consentManager } from './ConsentConfig';
import { safeStorage } from '../engine/LocalStorageStore';

class AdManager {
  private activeProvider: AdProvider;
  private refreshControllers: Map<string, RefreshController> = new Map();

  constructor() {
    this.activeProvider = this.resolveProvider();
  }

  private resolveProvider(): AdProvider {
    // Check if user has an active Teacher/Parent Pass
    const hasLicense = this.checkUserLicense();
    if (hasLicense) {
      return new NoneAdapter();
    }

    const defaultType = consentManager.getConfig().defaultProvider;
    if (defaultType === 'header-bidding') {
      return new HeaderBiddingAdapter();
    }
    if (defaultType === 'none') {
      return new NoneAdapter();
    }
    return new HouseAdAdapter();
  }

  private checkUserLicense(): boolean {
    if (typeof window === 'undefined') return false;
    const token = safeStorage.getItem('gf_license_token');
    return Boolean(token && token.length > 10);
  }

  public async init(): Promise<void> {
    await this.activeProvider.init();
  }

  public setProvider(provider: AdProvider): void {
    this.activeProvider = provider;
  }

  public getProviderName(): string {
    return this.activeProvider.name;
  }

  public renderSlot(container: HTMLElement, config: AdSlotConfig): void {
    this.activeProvider.renderSlot(container, config);

    // Register refresh controller
    if (!this.refreshControllers.has(config.slotId)) {
      this.refreshControllers.set(config.slotId, new RefreshController(container));
    }
  }

  /**
   * Called STRICTLY on round reset screens.
   */
  public handleRoundReset(slotId: string): boolean {
    const controller = this.refreshControllers.get(slotId);
    if (!controller) return false;

    const decision = controller.evaluateRoundResetRefresh();
    if (decision.canRefresh) {
      this.activeProvider.refreshSlot(slotId);
      return true;
    }
    return false;
  }

  public destroy(): void {
    this.activeProvider.destroy();
    for (const controller of this.refreshControllers.values()) {
      controller.destroy();
    }
    this.refreshControllers.clear();
  }
}

export const adManager = new AdManager();
