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

    let role: Role | null = null;

    if (submittedPassword && submittedPassword === adminPassword) {
      role = "admin";
    } else if (submittedPassword && submittedPassword === receptionPassword) {
      role = "reception";
    }

    if (!role) {
      // AUTH_DEBUG=true in Vercel env vars enables safe diagnostics — never logs secrets
      const debugEnabled = process.env.AUTH_DEBUG === "true";
      const errorBody: Record<string, unknown> = { error: "Invalid password" };

      if (debugEnabled) {
        errorBody.debug = {
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV ?? "not set",
          adminEnvExists: Boolean(process.env.ADMIN_PASSWORD),
          adminEnvLength: adminPassword?.length ?? 0,
          receptionEnvExists: Boolean(process.env.RECEPTION_PASSWORD),
          receptionEnvLength: receptionPassword?.length ?? 0,
          jwtSecretExists: Boolean(process.env.JWT_SECRET),
          submittedLength: submittedPassword.length,
          submittedEqualsAdmin: submittedPassword === adminPassword,
          submittedEqualsReception: submittedPassword === receptionPassword,
        };
      }

      return NextResponse.json(errorBody, { status: 401 });
    }

    await setSessionCookie(role);
    return NextResponse.json({ success: true, role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
