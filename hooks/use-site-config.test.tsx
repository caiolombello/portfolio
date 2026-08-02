// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSiteConfig } from "./use-site-config";

describe("useSiteConfig", () => {
  it("uses the bundled public config without fetching it again", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useSiteConfig());

    expect(result.current.loading).toBe(false);
    expect(result.current.config.site.shortName).toBe("Caio Barbieri");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
