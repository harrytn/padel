import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import type { Role } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    let role: Role | null = null;
    
    // Clean input and env vars in case of trailing spaces or literal quotes
    const cleanInput = (password || "").trim();
    const adminPass = (process.env.ADMIN_PASSWORD || "").replace(/['"]/g, "").trim();
    const recPass = (process.env.RECEPTION_PASSWORD || "").replace(/['"]/g, "").trim();

    if (cleanInput && cleanInput === adminPass) {
      role = "admin";
    } else if (cleanInput && cleanInput === recPass) {
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
