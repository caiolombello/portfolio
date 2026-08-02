import { describe, expect, it } from "vitest";

import { parseBlogPage } from "./blog-pagination";

describe("parseBlogPage", () => {
  it("accepts canonical positive integers", () => {
    expect(parseBlogPage("2")).toBe(2);
    expect(parseBlogPage("12")).toBe(12);
  });

  it("rejects partial and non-canonical values", () => {
    expect(parseBlogPage("2abc")).toBeNull();
    expect(parseBlogPage("02")).toBeNull();
    expect(parseBlogPage("1.5")).toBeNull();
  });
});
