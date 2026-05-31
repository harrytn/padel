import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Booking } from "@prisma/client";
import {
  generateTimeSlots,
  isPeakSlot,
  normalizeHour,
  parsePeakSlots,
} from "@/lib/slots";
import { requireStaff } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authResult = await requireStaff();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 });
  }

  let settings: any = null;
  let bookings: any[] = [];

  try {
    settings = await prisma.settings.findUnique({ where: { id: 1 } });
  } catch (error) {
    console.error("[ADMIN SCHEDULE ERROR] Failed to fetch settings from DB:", {
      message: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    bookings = await prisma.booking.findMany({
      where: { date },
      orderBy: { slot_start: "asc" },
    });
  } catch (error) {
    console.error("[ADMIN SCHEDULE ERROR] Failed to fetch bookings from DB:", {
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
    peak_slots: "[\"17:00\",\"18:30\",\"20:00\"]",
    slot_duration_minutes: 90
  };

  const activeSettings = settings || defaultSettings;

  try {
    const openTime = normalizeHour(activeSettings.open_hour);
    const closeTime = normalizeHour(activeSettings.close_hour);
    const duration = activeSettings.slot_duration_minutes || 90;
    const slotTimes = generateTimeSlots(openTime, closeTime, duration);

    const bookingMap = new Map<string, Booking>(bookings.map((b: Booking) => [b.slot_start, b]));
    const peakSlots = parsePeakSlots(activeSettings.peak_slots);

    // Only include peak slots that fall within the current schedule window
    const schedule = slotTimes.map((slotStart) => ({
      slotStart,
      isPeak: isPeakSlot(slotStart, peakSlots),
      booking: bookingMap.get(slotStart) || null,
    }));

    return NextResponse.json({ schedule, settings: activeSettings });
  } catch (error) {
    console.error("[ADMIN SCHEDULE ERROR] Failed to generate admin schedule:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
