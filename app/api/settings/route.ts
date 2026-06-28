import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, requireAdmin } from "@/lib/auth";
import { generateTimeSlots, normalizeHour } from "@/lib/slots";

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
      slot_duration_minutes,
      currency,
    } = body;

    // ── Normalize & validate opening/closing times ───────────────────────────
    const openTime = normalizeHour(open_hour);
    const closeTime = normalizeHour(close_hour);

    const timeRe = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRe.test(openTime)) {
      return NextResponse.json(
        { error: `Invalid open_hour format: "${open_hour}". Use HH:mm.` },
        { status: 400 }
      );
    }
    if (!timeRe.test(closeTime)) {
      return NextResponse.json(
        { error: `Invalid close_hour format: "${close_hour}". Use HH:mm.` },
        { status: 400 }
      );
    }
    if (openTime >= closeTime) {
      return NextResponse.json(
        { error: "open_hour must be before close_hour" },
        { status: 400 }
      );
    }
    const duration = Number(slot_duration_minutes);
    if (![20, 30, 60, 90].includes(duration)) {
      return NextResponse.json(
        { error: "Invalid slot_duration_minutes. Must be 20, 30, 60, or 90." },
        { status: 400 }
      );
    }

    if (currency !== "TND" && currency !== "EUR") {
      return NextResponse.json(
        { error: "Invalid currency. Must be TND or EUR." },
        { status: 400 }
      );
    }

    const slots = generateTimeSlots(openTime, closeTime, duration);
    if (slots.length === 0) {
      return NextResponse.json(
        { error: `The opening/closing window must allow at least one ${duration}-minute slot.` },
        { status: 400 }
      );
    }

    // ── Validate peak_slots is a valid JSON array ─────────────────────────────
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
        open_hour: openTime,
        close_hour: closeTime,
        lighting_trigger_hour,
        peak_slots: peakSlotsJson,
        slot_duration_minutes: duration,
        currency,
      },
      create: {
        id: 1,
        base_price: Number(base_price),
        racket_price_with_balls: Number(racket_price_with_balls),
        balls_only_price: Number(balls_only_price),
        lighting_price: Number(lighting_price),
        peak_premium: Number(peak_premium),
        open_hour: openTime,
        close_hour: closeTime,
        lighting_trigger_hour,
        peak_slots: peakSlotsJson,
        slot_duration_minutes: duration,
        currency,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
