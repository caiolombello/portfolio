import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { DevToolbar } from "../../../components/dev/toolbar";
import { render } from "../../test-utils";

// Mock the environment to be development
vi.mock("process", () => ({
  env: { NODE_ENV: "development" },
}));

// Mock the child components
vi.mock("../../../components/performance-monitor", () => ({
  PerformanceMonitor: () => (
    <div data-testid="performance-monitor">Performance Monitor</div>
  ),
}));

vi.mock("../../../components/a11y-checker", () => ({
  A11yChecker: () => <div data-testid="a11y-checker">A11y Checker</div>,
}));

interface StorageMock {
  store: Record<string, string>;
  clear: () => void;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

// Mock localStorage
const localStorageMock: StorageMock = {
  store: {},
  clear() {
    this.store = {};
  },
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, "location", {
  value: { reload: reloadMock },
  writable: true,
});

describe("DevToolbar", () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.stubEnv("NODE_ENV", "development");
  });

  it("renders correctly in development mode", () => {
    render(<DevToolbar />);
    expect(
      screen.getByRole("button", { name: /toggle toolbar/i }),
    ).toBeInTheDocument();
  });

  it("toggles visibility when clicked", () => {
    render(<DevToolbar />);
    const toggleButton = screen.getByRole("button", {
      name: /toggle toolbar/i,
    });

    // Initially collapsed
    expect(screen.queryByTestId("performance-monitor")).toBeNull();
    expect(screen.queryByTestId("a11y-checker")).toBeNull();

    // Click to expand
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("performance-monitor")).toBeInTheDocument();
    expect(screen.getByTestId("a11y-checker")).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("performance-monitor")).toBeNull();
    expect(screen.queryByTestId("a11y-checker")).toBeNull();
  });

  it("clears localStorage when clear button is clicked", () => {
    // Set some test data in localStorage
    localStorage.setItem("test-key", "test-value");

    render(<DevToolbar />);
    const toggleButton = screen.getByRole("button", {
      name: /toggle toolbar/i,
    });
    fireEvent.click(toggleButton);

    const clearButton = screen.getByRole("button", { name: /clear storage/i });
    fireEvent.click(clearButton);

    expect(localStorage.getItem("test-key")).toBeNull();
  });

  it("reloads the page when reload button is clicked", () => {
    render(<DevToolbar />);
    const toggleButton = screen.getByRole("button", {
      name: /toggle toolbar/i,
    });
    fireEvent.click(toggleButton);

    const reloadButton = screen.getByRole("button", { name: /reload page/i });
    fireEvent.click(reloadButton);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it("contains link to CMS", () => {
    render(<DevToolbar />);
    const toggleButton = screen.getByRole("button", {
      name: /toggle toolbar/i,
    });
    fireEvent.click(toggleButton);

    const cmsLink = screen.getByRole("link", { name: /cms/i });
    expect(cmsLink).toHaveAttribute("href", "/admin");
  });

  it("accepts and applies custom className", () => {
    render(<DevToolbar className="custom-toolbar" />);
    const toolbar = screen.getByRole("complementary");
    expect(toolbar).toHaveClass("custom-toolbar");
  });

  it("does not render in production mode", () => {
    vi.stubEnv("NODE_ENV", "production");
    const { container } = render(<DevToolbar />);
    expect(container).toBeEmptyDOMElement();
  });
});
