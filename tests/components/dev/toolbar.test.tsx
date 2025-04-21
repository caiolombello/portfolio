import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DevToolbar } from "@/components/dev/toolbar";

// Mock the environment to be development
vi.mock("process", () => ({
  env: { NODE_ENV: "development" },
}));

// Mock the child components
vi.mock("@/components/performance-monitor", () => ({
  PerformanceMonitor: () => (
    <div data-testid="performance-monitor">Performance Monitor</div>
  ),
}));

vi.mock("@/components/a11y-checker", () => ({
  A11yChecker: () => <div data-testid="a11y-checker">A11y Checker</div>,
}));

describe("DevToolbar", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
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

    fireEvent.click(toggleButton);
    expect(screen.getByTestId("performance-monitor")).toBeVisible();
    expect(screen.getByTestId("a11y-checker")).toBeVisible();

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("performance-monitor")).not.toBeVisible();
    expect(screen.queryByTestId("a11y-checker")).not.toBeVisible();
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
    const customClass = "custom-toolbar";
    render(<DevToolbar className={customClass} />);

    const toolbar = screen.getByRole("complementary");
    expect(toolbar).toHaveClass(customClass);
  });
});
