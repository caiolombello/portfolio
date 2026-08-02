// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileProvider, useProfile } from "./profile-context";
import type { Profile } from "@/types/profile";

const profile: Profile = {
  pt: {
    name: "Caio Barbieri",
    title: "Engenheiro DevOps Sênior",
    about: "Perfil em português",
  },
  en: {
    name: "Caio Barbieri",
    title: "Senior DevOps Engineer",
    about: "English profile",
  },
  email: "caio@example.com",
  socialLinks: { github: "https://github.com/caiolombello" },
};

function ProfileName() {
  const currentProfile = useProfile();
  return <span>{currentProfile?.en.name}</span>;
}

describe("ProfileProvider", () => {
  it("shares the server-loaded profile without a client request", () => {
    render(
      <ProfileProvider profile={profile}>
        <ProfileName />
      </ProfileProvider>,
    );

    expect(screen.getByText("Caio Barbieri")).not.toBeNull();
  });
});
