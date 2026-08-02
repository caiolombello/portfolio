export interface GiscusConfig {
  category?: string;
  categoryId?: string;
  repo?: string;
  repoId?: string;
}

export function buildGiscusAttributes(
  config: GiscusConfig,
  language: "pt" | "en",
  theme: "light" | "dark",
): Record<string, string> | null {
  if (
    !config.repo ||
    !/^[^/\s]+\/[^/\s]+$/.test(config.repo) ||
    !config.repoId ||
    !config.category ||
    !config.categoryId
  ) {
    return null;
  }

  return {
    "data-repo": config.repo,
    "data-repo-id": config.repoId,
    "data-category": config.category,
    "data-category-id": config.categoryId,
    "data-mapping": "pathname",
    "data-strict": "1",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": theme,
    "data-lang": language,
    "data-loading": "lazy",
  };
}
