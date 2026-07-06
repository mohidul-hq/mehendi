import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Customer from "@/models/Customer";
import Service from "@/models/Service";
import { bookingSchema } from "@/lib/validators";
import { addMinutes } from "@/lib/utils";
import {
  sendBookingConfirmationToCustomer,
  sendNewBookingAlertToAdmin,
} from "@/lib/email";
import { format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status && status !== "all") query.status = status;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate("customer")
      .populate("service")
      .sort({ date: -1, startTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ bookings, total, page, limit });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { serviceId, date, startTime, name, phone, email, venue, guests, notes } =
      parsed.data;

    // Fetch service for duration
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const endTime = addMinutes(startTime, service.durationMin);

    // Check for slot conflicts
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

    if (conflict) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please choose another time." },
        { status: 409 }
      );
    }

    // Create or find customer
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({ name, phone, email });
    } else {
      // Update name/email if provided
      if (name) customer.name = name;
      if (email) customer.email = email;
      await customer.save();
    }

    // Create booking
    const booking = await Booking.create({
      customer: customer._id,
      service: service._id,
      date: bookingDate,
      startTime,
      endTime,
      venue,
      guests: guests || 1,
      notes,
      status: "pending",
    });

    // Fire-and-forget email notifications
    const formattedDate = format(bookingDate, "EEEE, MMMM d, yyyy");
    const emailData = {
      customerName: name,
      customerEmail: email,
      serviceName: service.name,
      date: formattedDate,
      startTime,
      venue,
      bookingId: booking._id.toString(),
    };

    Promise.all([
      sendBookingConfirmationToCustomer(emailData),
      sendNewBookingAlertToAdmin(emailData),
    ]).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ booking, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
