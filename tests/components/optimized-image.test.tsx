import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "../test-utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

describe("OptimizedImage", () => {
  beforeEach(() => {
    // Reset any mocks between tests
  });

  it("renders with required props", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
      />,
    );

    const img = screen.getByAltText("Test image");
    expect(img).toBeInTheDocument();
  });

  it("applies loading state classes", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
      />,
    );

    const img = screen.getByAltText("Test image");
    expect(img).toHaveClass("scale-110", "blur-2xl", "grayscale");
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        className={customClass}
      />,
    );

    const container = screen.getByAltText("Test image").parentElement;
    expect(container).toHaveClass(customClass);
  });

  it("sets priority when specified", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        priority
      />,
    );

    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("uses custom sizes when provided", () => {
    const customSizes = "100vw";
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        sizes={customSizes}
      />,
    );

    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("sizes", customSizes);
  });
});
