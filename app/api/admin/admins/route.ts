import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Do not return passwordHash. Restrict to only the currently logged-in admin.
    const admins = await Admin.find({ email: session.user.email }).select("-passwordHash").sort({ createdAt: -1 });

    return NextResponse.json({ admins });
  } catch (error: any) {
    console.error("GET Admins error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectToDatabase();

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json({ error: "An admin with this email already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    return NextResponse.json({ 
      admin: {
        _id: newAdmin._id,
        email: newAdmin.email,
        createdAt: newAdmin.createdAt
      } 
    });
  } catch (error: any) {
    console.error("POST Admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
