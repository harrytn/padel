"use client";
import { createContext, useContext } from "react";
import type { Role } from "./auth";

// Re-export Role so client components can import it from here without
// pulling in server-only `jose` imports.
export type { Role };

const RoleContext = createContext<Role | null>(null);

export function RoleProvider({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

/** Must be called inside a component tree wrapped by RoleProvider. */
export function useRole(): Role {
  const role = useContext(RoleContext);
  if (!role) throw new Error("useRole() must be used within a <RoleProvider>.");
  return role;
}
