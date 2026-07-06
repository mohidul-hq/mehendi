/**
 * Seed script — run once to create the initial admin account and sample data
 * Usage: npm run seed
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
});

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  durationMin: Number,
  category: String,
  imageUrl: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

async function seed() {
  console.log("🌿 Taslima Mehendi Artist — Database Seeder\n");
  
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  const Admin = mongoose.model("Admin", AdminSchema);
  const Service = mongoose.model("Service", ServiceSchema);

  // ─── Admin Account ───────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = "Admin@1234"; // Change after first login!

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await Admin.create({ email: adminEmail, passwordHash });
    console.log(`✅ Admin created: ${adminEmail}`);
    console.log(`🔑 Default password: ${adminPassword}`);
    console.log("⚠️  PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN!\n");
  }

  // ─── Sample Services ─────────────────────────────────────────
  const servicesCount = await Service.countDocuments();
  if (servicesCount === 0) {
    const services = [
      {
        name: "Bridal Mehndi",
        description:
          "Exquisite full-hand and feet mehndi for brides. Includes intricate traditional patterns with hidden groom's name. Perfect for wedding day elegance.",
        price: 15000,
        durationMin: 240,
        category: "Bridal",
        imageUrl: "",
        active: true,
      },
      {
        name: "Arabic Mehndi",
        description:
          "Bold, floral Arabic-style mehndi designs. Quick application, stunning results. Ideal for eid, parties, and casual occasions.",
        price: 2500,
        durationMin: 60,
        category: "Arabic",
        imageUrl: "",
        active: true,
      },
      {
        name: "Party Mehndi",
        description:
          "Beautiful mehndi designs for functions, dholkis, and mehendi nights. Group bookings welcome with special rates.",
        price: 5000,
        durationMin: 120,
        category: "Party",
        imageUrl: "",
        active: true,
      },
      {
        name: "Kids Mehndi",
        description:
          "Fun, quick, and safe mehndi designs for children. Small motifs, flowers, and cartoon-inspired patterns kids will love.",
        price: 800,
        durationMin: 20,
        category: "Kids",
        imageUrl: "",
        active: true,
      },
    ];

    await Service.insertMany(services);
    console.log(`✅ ${services.length} sample services created`);
  } else {
    console.log(`ℹ️  Services already exist (${servicesCount} found), skipping`);
  }

  console.log("\n🎉 Seeding complete! You can now log in at /admin/login");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
