import { describe, expect, it } from "vitest";
import { GET, HEAD } from "./route";

describe("health endpoint", () => {
  it("returns only the public health status", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "healthy" });
  });

  it("supports a minimal HEAD probe", async () => {
    const response = await HEAD();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });
});
