import { describe, expect, it } from "vitest";

import { formatBlogDate, formatBlogDateShort, parseBlogDate } from "./blog-date";

describe("blog dates", () => {
  it("keeps a publication date on the same calendar day", () => {
    expect(formatBlogDate("2023-03-18", "pt")).toBe("18 de março de 2023");
    expect(formatBlogDate("2023-03-18", "en")).toBe("March 18, 2023");
    expect(formatBlogDateShort("2023-03-18", "pt")).toBe("18 de mar. de 2023");
    expect(parseBlogDate("2023-03-18").toISOString()).toBe(
      "2023-03-18T00:00:00.000Z",
    );
  });

  it("rejects a date that does not exist on the calendar", () => {
    expect(() => parseBlogDate("2026-02-31")).toThrow(/invalid blog date/i);
  });
});
