import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "../test-utils";
import { OptimizedImage } from "../../components/ui/optimized-image";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, className, onLoadingComplete, priority, ...props }: any) => {
    // Simulate image load
    setTimeout(() => onLoadingComplete?.(), 0);
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    );
  },
}));

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
    expect(screen.getByAltText("Test image")).toBeInTheDocument();
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
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        className="custom-class"
      />,
    );
    const container = screen.getByAltText("Test image").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("sets priority loading when specified", () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={100}
        height={100}
        priority={true}
      />,
    );
    const img = screen.getByAltText("Test image");
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("uses custom sizes when provided", () => {
    const customSizes = "(min-width: 1024px) 33vw, 100vw";
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
