import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { addMinutes } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { serviceId, date, startTime } = await req.json();

    if (!serviceId || !date || !startTime) {
      return NextResponse.json(
        { error: "serviceId, date, and startTime are required" },
        { status: 400 }
      );
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const endTime = addMinutes(startTime, service.durationMin);

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const conflict = await Booking.findOne({
      date: { $gte: bookingDate, $lt: nextDay },
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    return NextResponse.json({ available: !conflict });
  } catch (error) {
    console.error("check-slot error:", error);
    return NextResponse.json({ error: "Failed to check slot" }, { status: 500 });
  }
}
