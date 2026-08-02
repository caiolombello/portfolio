// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import NewsletterTokenActionForm from "./token-action-form";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("NewsletterTokenActionForm", () => {
  it("waits for explicit confirmation before activating a subscription", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ message: "Inscrição confirmada." }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(
      <NewsletterTokenActionForm
        kind="confirm"
        token="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN1234"
        apiUrl="https://example.execute-api.us-east-1.amazonaws.com"
      />,
    );

    expect(fetchMock).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Confirmar inscrição" }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.execute-api.us-east-1.amazonaws.com/subscriptions/confirm",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          token: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN1234",
        }),
      }),
    );
    expect(await screen.findByText("Inscrição confirmada.")).not.toBeNull();
  });

  it("does not submit an invalid or missing token", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <NewsletterTokenActionForm
        kind="unsubscribe"
        token={null}
        apiUrl="https://example.execute-api.us-east-1.amazonaws.com"
      />,
    );

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("alert").textContent).toContain(
      "link não é válido",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
