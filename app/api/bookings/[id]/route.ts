import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, requireAdmin } from "@/lib/auth";

/**
 * PATCH /api/bookings/[id]
 * Both Reception and Admin can update booking status (mark paid / pending / cancelled).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireStaff();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, action } = body;

    if (action === "RESTORE") {
      const adminAuth = await requireAdmin();
      if (adminAuth instanceof NextResponse) return adminAuth;

      const existing = await prisma.booking.findUnique({ where: { id } });
      if (!existing || existing.status !== "CANCELLED") {
        return NextResponse.json({ error: "Booking not cancelled" }, { status: 400 });
      }

      const conflict = await prisma.booking.findFirst({
        where: {
          date: existing.date,
          slot_start: existing.slot_start,
          status: { in: ["PENDING_PAYMENT", "PAID", "ARRIVED", "NO_SHOW"] },
        },
      });

      if (conflict) {
        return NextResponse.json({ error: "SLOT_TAKEN" }, { status: 409 });
      }

      const booking = await prisma.booking.update({
        where: { id },
        data: { status: "PENDING_PAYMENT", cancelled_at: null },
      });
      return NextResponse.json({ booking });
    }

    const validStatuses = ["PENDING_PAYMENT", "PAID", "CANCELLED", "ARRIVED", "NO_SHOW"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: any = { status };

    if (status === "ARRIVED") updateData.checked_in_at = new Date();
    if (status === "PAID") updateData.paid_at = new Date();
    if (status === "NO_SHOW") updateData.no_show_at = new Date();
    
    if (status === "CANCELLED") {
      updateData.cancelled_at = new Date();
    }

    const booking = await prisma.booking.update({ where: { id }, data: updateData });
    return NextResponse.json({ booking });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "SLOT_TAKEN" }, { status: 409 });
    }
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/bookings/[id]
 * Admin only — Reception staff cannot unblock/delete bookings.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
