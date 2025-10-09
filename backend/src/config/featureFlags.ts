interface FeatureFlags {
  enableGraphQL: boolean;
  enableWebSockets: boolean;
  enableAdvancedAnalytics: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  enableCacheWarming: boolean;
  maintenanceMode: boolean;
}

const defaultFlags: FeatureFlags = {
  enableGraphQL: false,
  enableWebSockets: false,
  enableAdvancedAnalytics: true,
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enableCacheWarming: false,
  maintenanceMode: false
};

class FeatureFlagService {
  private flags: FeatureFlags;

  constructor() {
    this.flags = { ...defaultFlags };
    this.loadFromEnv();
  }

  private loadFromEnv(): void {
    this.flags.enableGraphQL = process.env.FEATURE_GRAPHQL === 'true';
    this.flags.enableWebSockets = process.env.FEATURE_WEBSOCKETS === 'true';
    this.flags.enableAdvancedAnalytics = process.env.FEATURE_ANALYTICS !== 'false';
    this.flags.enableEmailNotifications = process.env.FEATURE_EMAIL !== 'false';
    this.flags.enableSMSNotifications = process.env.FEATURE_SMS === 'true';
    this.flags.enableCacheWarming = process.env.FEATURE_CACHE_WARMING === 'true';
    this.flags.maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  getAll(): FeatureFlags {
    return { ...this.flags };
  }

  setFlag(flag: keyof FeatureFlags, value: boolean): void {
    this.flags[flag] = value;
  }
}

export const featureFlags = new FeatureFlagService();
