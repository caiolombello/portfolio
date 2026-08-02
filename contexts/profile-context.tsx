"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Profile } from "@/types/profile";

const ProfileContext = createContext<Profile | null | undefined>(undefined);

export function ProfileProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile | null;
}) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): Profile | null {
  const profile = useContext(ProfileContext);
  if (profile === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return profile;
}
