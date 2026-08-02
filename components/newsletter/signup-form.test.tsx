import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import NewsletterSignupForm from "./signup-form";

vi.mock("@/components/turnstile-widget", () => ({
  TurnstileWidget: ({ onVerify }: { onVerify: (token: string) => void }) => (
    <button type="button" onClick={() => onVerify("challenge-token")}>
      Verify challenge
    </button>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("NewsletterSignupForm", () => {
  it("keeps signup closed without loading verification or calling the API", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <NewsletterSignupForm
        locale="pt"
        apiUrl="https://example.execute-api.us-east-1.amazonaws.com"
        signupEnabled={false}
      />,
    );

    expect(screen.queryByRole("button", { name: "Verify challenge" })).toBeNull();
    expect(
      (screen.getByRole("button", {
        name: "Inscrições em breve",
      }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends one validated request and prevents duplicate submission", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(
      <NewsletterSignupForm
        locale="pt"
        apiUrl="https://example.execute-api.us-east-1.amazonaws.com"
      />,
    );

    await user.type(
      screen.getByLabelText("Seu melhor e-mail"),
      "caio@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Verify challenge" }));
    const form = screen.getByRole("form", { name: "Inscrição na newsletter" });
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.execute-api.us-east-1.amazonaws.com/subscriptions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "caio@example.com",
          turnstileToken: "challenge-token",
        }),
      }),
    );

    resolveRequest?.(
      new Response(
        JSON.stringify({ message: "Confira seu e-mail para confirmar." }),
        { status: 202, headers: { "content-type": "application/json" } },
      ),
    );
    expect(
      await screen.findByText("Confira seu e-mail para confirmar."),
    ).not.toBeNull();
  });

  it("preserves the address when the service is temporarily unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: "As inscrições estão temporariamente indisponíveis.",
          }),
          { status: 503, headers: { "content-type": "application/json" } },
        ),
      ),
    );
    const user = userEvent.setup();
    render(
      <NewsletterSignupForm
        locale="pt"
        apiUrl="https://example.execute-api.us-east-1.amazonaws.com"
      />,
    );

    const email = screen.getByLabelText("Seu melhor e-mail");
    await user.type(email, "caio@example.com");
    await user.click(screen.getByRole("button", { name: "Verify challenge" }));
    await user.click(screen.getByRole("button", { name: "Quero receber" }));

    expect(
      await screen.findByText(
        "As inscrições estão temporariamente indisponíveis.",
      ),
    ).not.toBeNull();
    expect((email as HTMLInputElement).value).toBe("caio@example.com");
  });
});
// @vitest-environment jsdom
