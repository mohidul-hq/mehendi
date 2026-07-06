import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Availability from "@/models/Availability";

export async function GET() {
  try {
    await connectToDatabase();
    const availability = await Availability.find({}).sort({ dayOfWeek: 1 });
    return NextResponse.json({ availability });
  } catch {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const availability = await Availability.create(body);
    return NextResponse.json({ availability }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create availability" }, { status: 500 });
  }
}
