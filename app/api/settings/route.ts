import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, requireAdmin } from "@/lib/auth";

/**
 * GET /api/settings
 * Any authenticated staff member can read settings (needed for admin schedule page).
 */
export async function GET() {
  const authResult = await requireStaff();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/settings
 * Admin only — Reception cannot change pricing or schedule parameters.
 */
export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const {
      base_price,
      racket_price_with_balls,
      balls_only_price,
      lighting_price,
      peak_premium,
      open_hour,
      close_hour,
      lighting_trigger_hour,
      peak_slots,
    } = body;

    // Validate peak_slots is a valid JSON array
    let peakSlotsJson: string;
    try {
      const parsed =
        typeof peak_slots === "string" ? JSON.parse(peak_slots) : peak_slots;
      peakSlotsJson = JSON.stringify(parsed);
    } catch {
      return NextResponse.json(
        { error: "Invalid peak_slots format" },
        { status: 400 }
      );
    }

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        base_price: Number(base_price),
        racket_price_with_balls: Number(racket_price_with_balls),
        balls_only_price: Number(balls_only_price),
        lighting_price: Number(lighting_price),
        peak_premium: Number(peak_premium),
        open_hour: Number(open_hour),
        close_hour: Number(close_hour),
        lighting_trigger_hour,
        peak_slots: peakSlotsJson,
      },
      create: {
        id: 1,
        base_price: Number(base_price),
        racket_price_with_balls: Number(racket_price_with_balls),
        balls_only_price: Number(balls_only_price),
        lighting_price: Number(lighting_price),
        peak_premium: Number(peak_premium),
        open_hour: Number(open_hour),
        close_hour: Number(close_hour),
        lighting_trigger_hour,
        peak_slots: peakSlotsJson,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
