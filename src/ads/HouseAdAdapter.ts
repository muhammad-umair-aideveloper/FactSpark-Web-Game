import type { AdProvider, AdSlotConfig, RewardedAdOptions } from './types';

export class HouseAdAdapter implements AdProvider {
  public readonly name = 'house-ad';

  private promos = [
    {
      title: 'Teacher & Parent Pass — 100% Ad-Free Learning',
      sub: 'Unlock unlimited classroom playlists, printable worksheet bundles, and projector themes for $3.99/mo.',
      cta: 'Upgrade to Ad-Free Pass &rarr;',
      link: '/pass/'
    },
    {
      title: 'Built for Chromebook Classrooms',
      sub: "Zero student logins, zero passwords. We don't collect personal information from students. Get full teacher tools for $29/year.",
      cta: 'Learn About Teacher Pass &rarr;',
      link: '/pass/'
    }
  ];

  async init(): Promise<void> {
    // Immediate readiness, zero external scripts
  }

  renderSlot(container: HTMLElement, config: AdSlotConfig): void {
    const promo = this.promos[Math.floor(Math.random() * this.promos.length)];

    container.innerHTML = `
      <div class="house-ad-card" style="
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        color: #ffffff;
        border-radius: 10px;
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        min-height: ${config.minHeight}px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        text-decoration: none;
      ">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="background: rgba(255, 255, 255, 0.2); font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase;">Teacher Pass</span>
            <strong style="font-size: 1rem; color: #ffffff;">${promo.title}</strong>
          </div>
          <p style="margin: 0; font-size: 0.85rem; color: #c7d2fe; line-height: 1.4;">${promo.sub}</p>
        </div>
        <a href="${promo.link}" style="
          background: #4f46e5;
          color: #ffffff;
          border: 1px solid #818cf8;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.15s;
        ">${promo.cta}</a>
      </div>
    `;
  }

  refreshSlot(slotId: string): void {
    const container = document.getElementById(slotId);
    if (container) {
      this.renderSlot(container, {
        slotId,
        format: 'leaderboard',
        width: 728,
        height: 90,
        minHeight: 90
      });
    }
  }

  showRewardedAd(options: RewardedAdOptions): void {
    // Feature flagged off, but falls back to granting reward cleanly
    options.onRewardGranted();
  }

  destroy(): void {
    // No-op
  }
}
