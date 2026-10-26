export interface AdSlotConfig {
  slotId: string;
  format: 'leaderboard' | 'rectangle' | 'sticky_banner';
  width: number;
  height: number;
  minHeight: number;
}

export interface RewardedAdOptions {
  placement: string;
  onRewardGranted: () => void;
  onAdDismissed?: () => void;
  onError?: (err: string) => void;
}

export interface AdProvider {
  readonly name: string;
  init(): Promise<void>;
  renderSlot(container: HTMLElement, config: AdSlotConfig): void;
  refreshSlot(slotId: string): void;
  showRewardedAd?(options: RewardedAdOptions): void;
  destroy(): void;
}

export interface RefreshDecision {
  canRefresh: boolean;
  reason?: string;
  consecutiveViewableSeconds: number;
  sessionRefreshCount: number;
}
