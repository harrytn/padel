import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type Role = "admin" | "reception";

const COOKIE_NAME = "admin_session";
const EXPIRY = "8h";
const ALG = "HS256";

/** Lazy-load and encode the JWT secret — never falls back to a weak default. */
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set.");
  return new TextEncoder().encode(secret);
}

/** Mint a signed JWT containing { role } and return its compact string. */
export async function signRoleToken(role: Role): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

/**
 * Read the session cookie, verify the JWT signature, and return the role.
 * Returns null if the cookie is absent, expired, or tampered with.
 */
export async function getRole(): Promise<Role | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    const role = payload.role;
    if (role === "admin" || role === "reception") return role;
    return null;
  } catch {
    // Expired, malformed, or wrong signature → treat as unauthenticated
    return null;
  }
}

/** Set the session cookie with the signed JWT token. */
export async function setSessionCookie(role: Role): Promise<void> {
  const token = await signRoleToken(role);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

/** Clear the session cookie on logout. */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Route Guard Helpers ──────────────────────────────────────────────────────

/**
 * Requires any authenticated staff member (admin OR reception).
 * Returns the role on success, or a 401 NextResponse on failure.
 */
export async function requireStaff(): Promise<Role | NextResponse> {
  const role = await getRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return role;
}

/**
 * Requires the admin role specifically.
 * Returns true on success, a 401 if unauthenticated, or a 403 if reception.
 */
export async function requireAdmin(): Promise<true | NextResponse> {
  const role = await getRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden — Admin access required" }, { status: 403 });
  }
  return true;
}
