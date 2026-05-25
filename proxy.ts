import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const LOGIN_PATH = "/admin/login";

/**
 * Encode the JWT secret. If JWT_SECRET is missing during local dev, log a
 * clear error instead of silently failing and causing redirect loops.
 */
function getSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error(
      "[proxy] JWT_SECRET is not set. " +
      "Add it to your .env file. Blocking all /admin access until it is configured."
    );
    return null;
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Always let the login page through — no auth needed ────────────────
  if (pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  // ── 2. For every other /admin/* route, verify the JWT ────────────────────
  const secret = getSecret();
  if (!secret) {
    // Misconfigured env — redirect to login with a helpful query param
    return NextResponse.redirect(new URL(`${LOGIN_PATH}?error=misconfigured`, request.url));
  }

  const token = request.cookies.get("admin_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    // Valid JWT — let the request proceed to the layout/page
    return NextResponse.next();
  } catch {
    // Expired or tampered token — clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete("admin_session");
    return response;
  }
}

export const config = {
  // Run this proxy on all /admin routes (including /admin/login,
  // which is immediately allowed in step 1 above).
  matcher: ["/admin/:path*"],
};
