import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Service from "@/models/Service";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();

    const existingAdmin = await Admin.findOne({});
    const servicesCount = await Service.countDocuments();

    if (existingAdmin && servicesCount > 0) {
      return NextResponse.json(
        { error: "Admin and services already exist. Setup complete." },
        { status: 403 }
      );
    }

    let email = process.env.ADMIN_EMAIL || "admin@example.com";
    let password = "Admin@1234";

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(password, 12);
      await Admin.create({ email, passwordHash });
    } else {
      email = existingAdmin.email;
      password = "(already set)";
    }

    // Seed services if none exist
    let servicesCreated = 0;
    if (servicesCount === 0) {
      const sampleServices = [
        { name: "Bridal Mehndi", description: "Exquisite full-hand and feet mehndi for brides.", price: 15000, durationMin: 240, category: "Bridal", active: true },
        { name: "Arabic Mehndi", description: "Bold, floral Arabic-style mehndi designs.", price: 2500, durationMin: 60, category: "Arabic", active: true },
        { name: "Party Mehndi", description: "Beautiful mehndi designs for functions.", price: 5000, durationMin: 120, category: "Party", active: true },
        { name: "Kids Mehndi", description: "Fun, quick, and safe mehndi designs for children.", price: 800, durationMin: 20, category: "Kids", active: true },
      ];
      await Service.insertMany(sampleServices);
      servicesCreated = sampleServices.length;
    }

    return NextResponse.json({
      success: true,
      message: "✅ Admin user created successfully!",
      credentials: {
        email,
        password,
        loginUrl: `${process.env.NEXTAUTH_URL}/admin/login`,
      },
      warning: "⚠️ Change your password after first login!",
      servicesSeeded: servicesCreated,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin. Check your MONGODB_URI in .env" },
      { status: 500 }
    );
  }
}
