import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Star, ArrowRight, Sparkles } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export const metadata: Metadata = {
  title: "Taslima Mehendi Artist — Beautiful Mehndi Designs",
  description:
    "Professional mehndi artist specializing in Bridal, Arabic, Party, and Kids mehndi designs. Book your appointment today!",
};

async function getServices() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/services`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const { services } = await res.json();
    return services || [];
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/testimonials`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const { testimonials } = await res.json();
    return testimonials || [];
  } catch {
    return [];
  }
}

const categoryEmojis: Record<string, string> = {
  Bridal: "💍",
  Arabic: "🌙",
  Party: "🎉",
  Kids: "🌸",
};

// Fallback services if DB not connected
const fallbackServices = [
  { _id: "1", name: "Bridal Mehndi", description: "Exquisite full-hand bridal designs with traditional patterns and hidden groom's name.", price: 15000, durationMin: 240, category: "Bridal" },
  { _id: "2", name: "Arabic Mehndi", description: "Bold floral Arabic-style designs. Quick and stunning for eid and parties.", price: 2500, durationMin: 60, category: "Arabic" },
  { _id: "3", name: "Party Mehndi", description: "Beautiful designs for functions, dholkis, and mehendi nights.", price: 5000, durationMin: 120, category: "Party" },
  { _id: "4", name: "Kids Mehndi", description: "Fun, safe designs for children — flowers, stars, and cute motifs.", price: 800, durationMin: 20, category: "Kids" },
];

const fallbackTestimonials = [
  { _id: "1", name: "Ayesha Malik", message: "Absolutely stunning bridal mehndi! Taslima's work exceeded all my expectations. The designs were intricate and beautiful.", rating: 5 },
  { _id: "2", name: "Sara Khan", message: "Got Arabic mehndi for Eid and I couldn't be happier. So detailed and it lasted weeks!", rating: 5 },
  { _id: "3", name: "Zainab Ahmed", message: "Taslima is so professional and talented. My whole family got mehndi for the wedding and everyone loved it.", rating: 5 },
];

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([
    getServices(),
    getTestimonials(),
  ]);

  let settings = null;
  try {
    await connectToDatabase();
    // @ts-ignore
    const doc = await Settings.getSettings();
    settings = JSON.parse(JSON.stringify(doc));
  } catch (e) {}

  const displayServices = services.length > 0 ? services : fallbackServices;
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || "+923000000000";
  const whatsappLink = settings?.socialLinks?.find((l: any) => l.platform === "WhatsApp" && l.isActive);
  const whatsapp = whatsappLink ? whatsappLink.url : (process.env.NEXT_PUBLIC_WHATSAPP || "923000000000");

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0d11 0%, #3d1420 40%, #6B2737 70%, #a02440 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold-500 opacity-10 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-burgundy-600 opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold-500/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-base text-center px-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles size={14} className="text-gold-400" />
            <span className="text-gold-300 text-sm font-medium">Professional Mehndi Artist</span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            The Art of{" "}
            <span className="text-gold-400">Mehndi</span>
            <br />
            <span className="italic text-3xl sm:text-4xl md:text-5xl opacity-90">by Taslima</span>
          </h1>

          <p className="text-cream-200 text-lg md:text-xl max-w-lg mx-auto mb-8 leading-relaxed">
            Exquisite bridal, Arabic, and party mehndi designs crafted with passion.
            Your special day deserves the finest artistry.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/book" className="btn-gold text-base px-8 py-4">
              <CalendarIcon size={20} />
              Book Now
            </Link>
            <Link href="/portfolio" className="btn-outline border-white/50 text-white hover:bg-white hover:text-burgundy-900 px-8 py-4">
              View Portfolio
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Tap to call */}
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 transition-colors text-sm"
          >
            <Phone size={16} />
            Tap to call: {phone}
          </a>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-white/10">
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "10+", label: "Years Experience" },
              { value: "5★", label: "Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-playfair text-2xl md:text-3xl font-bold text-gold-400">{value}</div>
                <div className="text-cream-300 text-xs md:text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-gold-400/50" />
          <div className="w-2 h-2 rounded-full bg-gold-400" />
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-base">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle mx-auto">
              From intimate bridal ceremonies to joyful celebrations — we craft every design with love.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayServices.map((service: {
              _id: string;
              name: string;
              description: string;
              price: number;
              durationMin: number;
              category: string;
            }) => (
              <div
                key={service._id}
                className="group card hover:border-gold-400 border-2 border-transparent cursor-pointer"
              >
                <div className="text-4xl mb-3">
                  {categoryEmojis[service.category] || "🌿"}
                </div>
                <h3 className="font-playfair text-xl font-bold text-burgundy-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Starting from</div>
                    <div className="font-bold text-burgundy-900 text-lg">
                      INR {service.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    ~{service.durationMin >= 60
                      ? `${Math.floor(service.durationMin / 60)}h${service.durationMin % 60 > 0 ? ` ${service.durationMin % 60}m` : ""}`
                      : `${service.durationMin}min`}
                  </div>
                </div>
                <Link
                  href={`/book?service=${service._id}`}
                  className="btn-primary w-full mt-4 text-sm py-2.5 group-hover:bg-gold-500 transition-colors"
                >
                  Book This
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="btn-outline">
              See All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="section bg-burgundy-900">
        <div className="container-base">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-3">
              Why Choose Taslima?
            </h2>
            <p className="text-cream-200 max-w-lg mx-auto">
              A decade of artistry, thousands of happy clients, and a commitment to perfection.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏆", title: "Award Winning", desc: "Recognized for excellence in bridal mehndi" },
              { icon: "🌿", title: "Natural Henna", desc: "100% natural henna, safe for all skin types" },
              { icon: "⏰", title: "Punctual", desc: "Always on time, every time" },
              { icon: "📱", title: "Easy Booking", desc: "Book in minutes from your phone" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-4">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-cream-200 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="section bg-cream-50">
        <div className="container-base">
          <div className="text-center mb-10">
            <h2 className="section-title">What Clients Say</h2>
            <p className="section-subtitle mx-auto">Real reviews from real brides and celebrations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.slice(0, 3).map((t: {
              _id: string;
              name: string;
              message: string;
              rating: number;
            }) => (
              <div key={t._id} className="card">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-gray-600 italic text-sm leading-relaxed mb-4">
                  &ldquo;{t.message}&rdquo;
                </p>
                <div className="font-semibold text-burgundy-900">— {t.name}</div>
              </div>
            ))}
          </div>
          {/* Submit review CTA */}
          <div className="text-center mt-8">
            <Link href="/contact#review" className="btn-outline text-sm">
              Leave a Review ✍️
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────────── */}
      <section
        className="py-16 text-center"
        style={{
          background: "linear-gradient(135deg, #FAF7F2 0%, #f5ede0 100%)",
        }}
      >
        <div className="container-base max-w-2xl">
          <h2 className="section-title mb-3">Ready for Your Perfect Mehndi?</h2>
          <p className="section-subtitle mb-8 mx-auto">
            Book your appointment in just a few taps. Limited slots available!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="btn-primary px-8 py-4 text-base">
              <CalendarIcon size={20} />
              Book Appointment
            </Link>
            {whatsappLink && (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi! I'd like to inquire about your mehndi services.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-8 py-4 text-base"
              >
                💬 WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// Inline icon component (no import needed for this simple one)
function CalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
