import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    // @ts-ignore - getSettings is a static method we added
    const settings = await Settings.getSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phone, socialLinks } = await req.json();

    await connectToDatabase();
    
    // Update the global settings
    const settings = await Settings.findOneAndUpdate(
      { singletonId: "global" },
      { phone, socialLinks },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings POST Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
