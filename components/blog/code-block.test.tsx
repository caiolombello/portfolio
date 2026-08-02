// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CodeBlock from "./code-block";

describe("CodeBlock", () => {
  it("copies the code and announces success", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(
      <CodeBlock code="kubectl get hpa" language="pt">
        <code>kubectl get hpa</code>
      </CodeBlock>,
    );
    await user.click(screen.getByRole("button", { name: "Copiar código" }));

    expect(writeText).toHaveBeenCalledWith("kubectl get hpa");
    expect(
      screen.getByRole("button", { name: "Copiar código" }).textContent,
    ).toContain("Copiado");
  });
});
