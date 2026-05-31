import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateTimeSlots,
  getSlotEnd,
  isPeakSlot,
  needsLightingOption,
  normalizeHour,
  parsePeakSlots,
} from "@/lib/slots";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date parameter" }, { status: 400 });
  }

  let settings: any = null;
  let bookings: any[] = [];

  try {
    settings = await prisma.settings.findUnique({ where: { id: 1 } });
  } catch (error) {
    console.error("[SLOTS API ERROR] Failed to fetch Settings from DB:", {
      message: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    bookings = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ["PENDING_PAYMENT", "PAID", "ARRIVED", "NO_SHOW"] },
      },
      select: { slot_start: true, type: true, status: true },
    });
  } catch (error) {
    console.error("[SLOTS API ERROR] Failed to fetch Bookings from DB:", {
      message: error instanceof Error ? error.message : String(error),
    });
  }

  const defaultSettings = {
    id: 1,
    base_price: 100,
    racket_price_with_balls: 5,
    balls_only_price: 10,
    lighting_price: 20,
    peak_premium: 10,
    open_hour: "08:00",
    close_hour: "22:00",
    lighting_trigger_hour: "18:30",
    peak_slots: "[\"17:00\",\"18:30\",\"20:00\"]"
  };

  const activeSettings = settings || defaultSettings;

  try {
    const openTime = normalizeHour(activeSettings.open_hour);
    const closeTime = normalizeHour(activeSettings.close_hour);
    const slotTimes = generateTimeSlots(openTime, closeTime);

    const bookedSlots = new Set(bookings.map((b: { slot_start: string }) => b.slot_start));
    const peakSlots = parsePeakSlots(activeSettings.peak_slots);

    const slots = slotTimes.map((slotStart) => ({
      slotStart,
      slotEnd: getSlotEnd(slotStart),
      isAvailable: !bookedSlots.has(slotStart),
      isPeak: isPeakSlot(slotStart, peakSlots),
      hasLighting: needsLightingOption(slotStart, activeSettings.lighting_trigger_hour || "18:30"),
      basePrice: activeSettings.base_price,
      peakPremium: activeSettings.peak_premium,
    }));

    return NextResponse.json({ slots, settings: activeSettings });
  } catch (error) {
    console.error("[SLOTS API ERROR] Failed to generate slot structure:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
