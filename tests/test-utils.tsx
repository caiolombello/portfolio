import React from "react";
import { render, RenderOptions, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { vi, beforeAll, afterEach } from "vitest";
import { JSDOM } from "jsdom";

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock getDictionary
vi.mock("@/app/i18n", () => ({
  getDictionary: vi.fn().mockResolvedValue({
    common: {
      loading: "Loading...",
    },
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
    },
  }),
  locales: ["en", "pt", "es"],
}));

// Mock ThemeProvider to avoid script injection in tests
vi.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock LanguageProvider to avoid loading state in tests
vi.mock("@/contexts/language-context", () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => {
    if (!children) return null;
    return children;
  },
  useLanguage: () => ({
    language: "en",
    changeLanguage: vi.fn(),
    t: (key: string) => key,
    loading: false,
  }),
}));

// Create a DOM environment if it doesn't exist
if (!globalThis.document) {
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  globalThis.document = dom.window.document;
  globalThis.window = dom.window as unknown as Window & typeof globalThis;
}

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  if (!children) return null;
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Common test utilities
export const mockMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

export const mockIntersectionObserver = () => {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  });
};

export const mockResizeObserver = () => {
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  });
};
