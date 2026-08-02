import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("newsletter one-click unsubscribe route", () => {
  it("forwards a valid token without returning it in the response", async () => {
    const token = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN1234";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Descadastro concluído." }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request(
        `https://caio.lombello.com/newsletter/unsubscribe/one-click?token=${token}`,
        { method: "POST" },
      ),
    );

    expect(response.status).toBe(204);
    expect(await response.text()).not.toContain(token);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://ryvtguwxbf.execute-api.us-east-1.amazonaws.com/subscriptions/unsubscribe",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    );
  });

  it("rejects malformed tokens before calling the backend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request(
        "https://caio.lombello.com/newsletter/unsubscribe/one-click?token=bad",
        { method: "POST" },
      ),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
