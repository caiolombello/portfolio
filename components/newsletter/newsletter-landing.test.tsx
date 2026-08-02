// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import NewsletterLanding from "./newsletter-landing";

afterEach(cleanup);

describe("NewsletterLanding", () => {
  it("shows a human signup status while email delivery is being prepared", () => {
    render(
      <NewsletterLanding
        locale="pt"
        apiUrl="https://example.execute-api.us-east-1.amazonaws.com"
        issues={[]}
        archiveAvailable
        signupEnabled={false}
      />,
    );

    expect(screen.getByText("Em preparação")).not.toBeNull();
    expect(screen.queryByText("signal_status: ready")).toBeNull();
    expect(screen.getByRole("button", { name: "Inscrições em breve" })).not.toBeNull();
  });
});
