import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    // Admin can see all, public only sees approved
    const query = session && all ? {} : { approved: true };
    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ testimonials });
  } catch {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Public submission — approved: false by default
    const testimonial = await Testimonial.create({
      ...parsed.data,
      approved: false,
    });

    return NextResponse.json({ testimonial, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit testimonial" }, { status: 500 });
  }
}
