import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ALL_SLOTS, isPeakSlot, parsePeakSlots } from "@/lib/slots";
import { cookies } from "next/headers";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 });
  }

  try {
    const [settings, bookings] = await Promise.all([
      prisma.settings.findUnique({ where: { id: 1 } }),
      prisma.booking.findMany({
        where: { date },
        orderBy: { slot_start: "asc" },
      }),
    ]);

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 500 });
    }

    const bookingMap = new Map<string, any>(bookings.map((b) => [b.slot_start, b]));
    const peakSlots = parsePeakSlots(settings.peak_slots);

    const schedule = ALL_SLOTS.map((slotStart) => ({
      slotStart,
      isPeak: isPeakSlot(slotStart, peakSlots),
      booking: bookingMap.get(slotStart) || null,
    }));

    return NextResponse.json({ schedule, settings });
  } catch (error) {
    console.error("GET /api/admin/schedule error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
