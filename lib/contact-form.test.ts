import { describe, expect, it } from "vitest";
import {
  buildFormspreePayload,
  getFormspreeErrorKey,
} from "./contact-form";

const formData = {
  name: "Caio",
  email: "caio@example.com",
  message: "Uma mensagem de teste.",
  _gotcha: "",
};

describe("buildFormspreePayload", () => {
  it("includes the Turnstile token using Formspree's expected field name", () => {
    expect(buildFormspreePayload(formData, "verified-token")).toEqual({
      ...formData,
      "cf-turnstile-response": "verified-token",
    });
  });

  it("rejects a submission without a Turnstile token", () => {
    expect(() => buildFormspreePayload(formData, "")).toThrow(
      "Turnstile verification is required",
    );
  });
});

describe("getFormspreeErrorKey", () => {
  it("returns a specific message key when Formspree rate limits the form", () => {
    expect(getFormspreeErrorKey(429)).toBe("rateLimitMessage");
  });

  it("keeps the generic message for other Formspree failures", () => {
    expect(getFormspreeErrorKey(500)).toBe("errorMessage");
  });
});
