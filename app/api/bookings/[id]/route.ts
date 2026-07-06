import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { sendBookingStatusUpdate } from "@/lib/email";
import { format } from "date-fns";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const booking = await Booking.findById(params.id)
      .populate("customer")
      .populate("service");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const booking = await Booking.findByIdAndUpdate(params.id, body, {
      new: true,
    })
      .populate("customer")
      .populate("service");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Send status update email if status changed
    if (body.status && booking.customer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const customer = booking.customer as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const service = booking.service as any;
      if (customer?.email) {
        sendBookingStatusUpdate(
          customer.email,
          customer.name,
          body.status,
          service?.name || "Mehndi Service",
          format(new Date(booking.date), "MMMM d, yyyy")
        ).catch((err) => console.error("Status email failed:", err));
      }
    }

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    await Booking.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
