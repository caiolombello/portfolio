export interface SiteFeaturesConfig {
  features?: {
    portfolio?: boolean;
  };
}

export function isPortfolioEnabled(config: SiteFeaturesConfig): boolean {
  return config.features?.portfolio !== false;
}
