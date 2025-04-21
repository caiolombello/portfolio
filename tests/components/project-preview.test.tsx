import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "../test-utils";
import { ProjectPreview } from "../../components/cms/project-preview";

// Mock PreviewWrapper component
vi.mock("../../components/cms/preview-wrapper", () => ({
  PreviewWrapper: ({ children, locale }: any) => (
    <div data-locale={locale}>{children}</div>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, className, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  ),
}));

describe("ProjectPreview", () => {
  const mockEntry = {
    getIn: (path: string[]) => {
      const data: Record<string, any> = {
        title: "Test Project",
        description: "A test project description",
        image: "/test-image.jpg",
        technologies: ["React", "TypeScript"],
        url: "https://example.com",
        github: "https://github.com/test",
        featured: true,
        locale: "en",
      };
      return data[path[1]];
    },
  };

  beforeEach(() => {
    // Reset any mocks between tests
  });

  it("renders project details correctly", () => {
    render(<ProjectPreview entry={mockEntry} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A test project description")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Live Demo →")).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByText("GitHub →")).toHaveAttribute(
      "href",
      "https://github.com/test",
    );
  });

  it("shows featured badge when project is featured", () => {
    render(<ProjectPreview entry={mockEntry} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("handles missing optional fields", () => {
    const minimalEntry = {
      getIn: (path: string[]) => {
        const data: Record<string, any> = {
          title: "Minimal Project",
          description: "Minimal description",
        };
        return data[path[1]];
      },
    };

    render(<ProjectPreview entry={minimalEntry} />);

    expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    expect(screen.getByText("Minimal description")).toBeInTheDocument();
    expect(screen.queryByText("Live Demo →")).not.toBeInTheDocument();
    expect(screen.queryByText("GitHub →")).not.toBeInTheDocument();
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("renders with correct locale", () => {
    render(<ProjectPreview entry={mockEntry} />);
    expect(document.querySelector('[data-locale="en"]')).toBeInTheDocument();
  });

  it("applies featured styling correctly", () => {
    render(<ProjectPreview entry={mockEntry} />);
    const article = screen.getByRole("article");
    expect(article).toHaveClass("ring-2", "ring-primary");
  });
});
