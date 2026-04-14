import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_SLOTS, isPeakSlot, needsLightingOption, parsePeakSlots } from "@/lib/slots";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date parameter" }, { status: 400 });
  }

  try {
    const [settings, bookings] = await Promise.all([
      prisma.settings.findUnique({ where: { id: 1 } }),
      prisma.booking.findMany({
        where: {
          date,
          status: { in: ["PENDING_PAYMENT", "PAID"] },
        },
        select: { slot_start: true, type: true, status: true },
      }),
    ]);

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 500 });
    }

    const bookedSlots = new Set(bookings.map((b: any) => b.slot_start));
    const peakSlots = parsePeakSlots(settings.peak_slots);

    const slots = ALL_SLOTS.map((slotStart) => ({
      slotStart,
      slotEnd: getSlotEnd(slotStart),
      isAvailable: !bookedSlots.has(slotStart),
      isPeak: isPeakSlot(slotStart, peakSlots),
      hasLighting: needsLightingOption(slotStart, settings.lighting_trigger_hour),
      basePrice: settings.base_price,
      peakPremium: settings.peak_premium,
    }));

    return NextResponse.json({ slots, settings });
  } catch (error) {
    console.error("GET /api/slots error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function getSlotEnd(start: string): string {
  const [hours, minutes] = start.split(":").map(Number);
  const total = hours * 60 + minutes + 90;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
