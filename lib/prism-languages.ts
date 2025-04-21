import Prism from "prismjs";

// Common languages that should be loaded by default
const COMMON_LANGUAGES = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "bash",
  "json",
] as const;

// Map of language aliases to their actual Prism language names
const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
};

// Languages that require additional components
const LANGUAGE_DEPENDENCIES: Record<string, string[]> = {
  tsx: ["jsx", "typescript"],
  jsx: ["javascript"],
};

const loadedLanguages = new Set<string>();

async function loadLanguage(lang: string): Promise<void> {
  const normalizedLang = LANGUAGE_ALIASES[lang] || lang;

  if (loadedLanguages.has(normalizedLang)) {
    return;
  }

  try {
    // Load dependencies first
    const dependencies = LANGUAGE_DEPENDENCIES[normalizedLang] || [];
    await Promise.all(dependencies.map(loadLanguage));

    // Load the language
    await import(`prismjs/components/prism-${normalizedLang}`);
    loadedLanguages.add(normalizedLang);
  } catch (error) {
    console.warn(`Failed to load Prism language: ${normalizedLang}`, error);
  }
}

export async function initializePrism(): Promise<void> {
  // Load common languages
  await Promise.all(COMMON_LANGUAGES.map(loadLanguage));
}

export async function highlightCode(
  code: string,
  language: string,
): Promise<string> {
  const normalizedLang = LANGUAGE_ALIASES[language] || language;

  if (!loadedLanguages.has(normalizedLang)) {
    await loadLanguage(normalizedLang);
  }

  try {
    return Prism.highlight(
      code,
      Prism.languages[normalizedLang] || Prism.languages.plaintext,
      normalizedLang,
    );
  } catch (error) {
    console.warn(
      `Failed to highlight code for language: ${normalizedLang}`,
      error,
    );
    return code;
  }
}
