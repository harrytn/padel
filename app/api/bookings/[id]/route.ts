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
    const { status } = body;

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
      const existing = await prisma.booking.findUnique({ where: { id } });
      if (existing && !existing.slot_start.includes("_CANCELLED")) {
        updateData.slot_start = `${existing.slot_start}_CANCELLED_${Date.now()}`;
      }
    }

    const booking = await prisma.booking.update({ where: { id }, data: updateData });
    return NextResponse.json({ booking });
  } catch (error) {
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
