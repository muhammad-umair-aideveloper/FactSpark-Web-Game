/**
 * Central child privacy and advertising compliance configuration.
 * Strictly enforces COPPA, FERPA, and GDPR-K child-directed requirements by default.
 */

export interface PrivacyConsentConfig {
  childDirectedTreatment: boolean;
  underAgeOfConsent: boolean;
  nonPersonalizedAdsOnly: boolean;
  allowBehavioralTracking: boolean;
  collectStudentPii: boolean;
  requireEuConsentBanner: boolean;
  defaultProvider: 'house-ad' | 'none' | 'header-bidding';
  rewardedAdsEnabled: boolean; // Feature flagged OFF by default
  refreshViewabilitySeconds: number;
  maxRefreshesPerSession: number;
}

export const defaultConsentConfig: PrivacyConsentConfig = {
  // Child protection laws (COPPA / GDPR-K / FERPA)
  childDirectedTreatment: true,
  underAgeOfConsent: true,
  nonPersonalizedAdsOnly: true,
  allowBehavioralTracking: false,
  collectStudentPii: false,
  requireEuConsentBanner: false, // Non-personalized contextual ads only, zero tracking cookies

  // Ad network configuration
  defaultProvider: 'house-ad',
  rewardedAdsEnabled: false, // Feature-flagged OFF by default

  // Refresh policy
  refreshViewabilitySeconds: 30, // Must be viewable for at least 30 continuous seconds
  maxRefreshesPerSession: 4       // Hard cap per classroom session
};

class ConsentManager {
  private config: PrivacyConsentConfig;

  constructor(initialConfig: PrivacyConsentConfig = defaultConsentConfig) {
    this.config = { ...initialConfig };
  }

  public getConfig(): PrivacyConsentConfig {
    return { ...this.config };
  }

  public setConfig(updates: Partial<PrivacyConsentConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public isChildDirected(): boolean {
    return this.config.childDirectedTreatment;
  }

  public areRewardedAdsAllowed(): boolean {
    return this.config.rewardedAdsEnabled;
  }
}

export const consentManager = new ConsentManager();
