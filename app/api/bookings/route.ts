import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPeakSlot, needsLightingOption, parsePeakSlots } from "@/lib/slots";
import { calculatePrice, generateBookingPin } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      slotStart,
      firstName,
      lastName,
      roomNumber,
      racketCount,
      boughtBallsOnly,
      needsLighting,
    } = body;

    // Validation
    if (!date || !slotStart || !firstName || !lastName || !roomNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (racketCount < 0 || racketCount > 4) {
      return NextResponse.json(
        { error: "Invalid racket count (0-4)" },
        { status: 400 }
      );
    }

    // Fetch settings for server-side price calculation
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 500 });
    }

    const peakSlots = parsePeakSlots(settings.peak_slots);
    const peak = isPeakSlot(slotStart, peakSlots);
    const lightingApplicable = needsLightingOption(slotStart, settings.lighting_trigger_hour);

    const breakdown = calculatePrice({
      basePrice: settings.base_price,
      isPeak: peak,
      peakPremium: settings.peak_premium,
      racketCount: Number(racketCount),
      racketPriceWithBalls: settings.racket_price_with_balls,
      boughtBallsOnly: Boolean(boughtBallsOnly),
      ballsOnlyPrice: settings.balls_only_price,
      needsLighting: lightingApplicable && Boolean(needsLighting),
      lightingPrice: settings.lighting_price,
    });

    const bookingPin = generateBookingPin();

    // Create booking — @@unique([date, slot_start]) will throw P2002 if double-booked
    const booking = await prisma.booking.create({
      data: {
        booking_pin: bookingPin,
        type: "TOURIST_BOOKING",
        customer_first_name: firstName,
        customer_last_name: lastName,
        room_number: roomNumber,
        date,
        slot_start: slotStart,
        racket_count: Number(racketCount),
        bought_balls_only: Boolean(boughtBallsOnly) && Number(racketCount) === 0,
        needs_lighting: lightingApplicable && Boolean(needsLighting),
        total_price: breakdown.total,
        status: "PENDING_PAYMENT",
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: unknown) {
    // Prisma unique constraint violation — slot was taken concurrently
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "SLOT_TAKEN", message: "This slot has just been booked by another guest." },
        { status: 409 }
      );
    }
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
