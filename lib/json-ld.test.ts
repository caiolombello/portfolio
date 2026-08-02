import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("prevents HTML from terminating the structured-data script", () => {
    const serialized = serializeJsonLd({
      description: "</script><script>alert('xss')</script>",
    });

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
  });
});
