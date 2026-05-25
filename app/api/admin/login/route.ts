import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import type { Role } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    let role: Role | null = null;

    if (password && password === process.env.ADMIN_PASSWORD) {
      role = "admin";
    } else if (password && password === process.env.RECEPTION_PASSWORD) {
      role = "reception";
    }

    if (!role) {
      // Use the same generic error for both wrong-role and wrong-password
      // to avoid leaking which passwords exist.
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await setSessionCookie(role);
    return NextResponse.json({ success: true, role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
