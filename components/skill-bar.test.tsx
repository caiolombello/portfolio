// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import SkillsList from "./skill-bar";
import type { Skill } from "@/types/skill";

vi.mock("@/contexts/language-context", () => ({
  useLanguage: () => ({ language: "pt" }),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const skills: Skill[] = [
  { name: "AWS", category: "Cloud/Infra", level: "Avançado" },
  { name: "Terraform", category: "Cloud/Infra", level: "Experiente" },
  { name: "Golang", category: "Linguagens", level: "Proficiente" },
];

describe("SkillsList", () => {
  it("shows only levels present in the data with clear accessible labels", () => {
    render(<SkillsList initialSkills={skills} />);

    expect(screen.getByText("Principal")).not.toBeNull();
    expect(screen.getByText("Uso recorrente")).not.toBeNull();
    expect(screen.getByText("Uso prático")).not.toBeNull();
    expect(screen.queryByText("Familiaridade")).toBeNull();

    expect(screen.getByLabelText("AWS: Principal")).not.toBeNull();
    expect(screen.getByLabelText("Terraform: Uso recorrente")).not.toBeNull();
    expect(screen.getByLabelText("Golang: Uso prático")).not.toBeNull();
  });
});
