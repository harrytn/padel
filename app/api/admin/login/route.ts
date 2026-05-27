import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import type { Role } from "@/lib/auth";

/**
 * Strips surrounding quotes and whitespace that can appear when env values
 * are accidentally written as: PASSWORD="value"  (quotes included in string)
 */
function normalizeSecret(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.trim().replace(/^['"]|['"]$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const submittedPassword = String(password ?? "").trim();

    const adminPassword = normalizeSecret(process.env.ADMIN_PASSWORD);
    const receptionPassword = normalizeSecret(process.env.RECEPTION_PASSWORD);

    // Dev-only safe debug log — does NOT log actual password values
    if (process.env.NODE_ENV !== "production") {
      console.log("[AUTH DEBUG]", {
        submittedPasswordLength: submittedPassword.length,
        adminEnvExists: Boolean(adminPassword),
        adminEnvLength: adminPassword?.length,
        receptionEnvExists: Boolean(receptionPassword),
        receptionEnvLength: receptionPassword?.length,
      });
    }

    // Guard: env not configured
    if (!adminPassword || !receptionPassword) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Server authentication configuration missing." },
          { status: 500 }
        );
      }
      console.error("[AUTH] ADMIN_PASSWORD or RECEPTION_PASSWORD env variable is not set.");
    }

    let role: Role | null = null;

    if (submittedPassword && submittedPassword === adminPassword) {
      role = "admin";
      if (process.env.NODE_ENV !== "production") {
        console.log("[AUTH DEBUG] Matched: admin branch");
      }
    } else if (submittedPassword && submittedPassword === receptionPassword) {
      role = "reception";
      if (process.env.NODE_ENV !== "production") {
        console.log("[AUTH DEBUG] Matched: reception branch");
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("[AUTH DEBUG] Matched: unknown role branch — no match");
      }
    }

    if (!role) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await setSessionCookie(role);
    return NextResponse.json({ success: true, role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
