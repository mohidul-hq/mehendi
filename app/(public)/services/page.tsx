import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Explore our mehndi services: Bridal, Arabic, Party, and Kids designs. Transparent pricing and flexible booking.",
};

const services = [
  {
    id: "bridal",
    name: "Bridal Mehndi",
    emoji: "💍",
    tagline: "Your wedding day deserves perfection",
    description:
      "Our signature bridal package includes full hands and feet with intricate traditional patterns. We hide the groom's name within the design — a beloved tradition that brings joy to the celebration. Sessions include consultation, design planning, and the application itself.",
    price: 15000,
    durationMin: 240,
    category: "Bridal",
    includes: [
      "Full hands (front and back)",
      "Full feet",
      "Hidden groom's name",
      "Design consultation",
      "Natural henna cone",
      "Aftercare instructions",
    ],
    popular: true,
  },
  {
    id: "arabic",
    name: "Arabic Mehndi",
    emoji: "🌙",
    tagline: "Bold, floral, and breathtaking",
    description:
      "Arabic-style mehndi features bold floral motifs with generous negative space, creating a striking look that photographs beautifully. Perfect for Eid celebrations, parties, or anyone who wants standout henna with minimal application time.",
    price: 2500,
    durationMin: 60,
    category: "Arabic",
    includes: [
      "One hand or both hands",
      "Bold floral patterns",
      "Natural henna",
      "Aftercare tips",
    ],
    popular: false,
  },
  {
    id: "party",
    name: "Party Mehndi",
    emoji: "🎉",
    tagline: "Celebrate in style",
    description:
      "Perfect for dholkis, mehendi nights, and family functions. We offer group rates for 5+ guests, making this ideal for pre-wedding events. Each guest gets a beautiful, personalized design within the session time.",
    price: 5000,
    durationMin: 120,
    category: "Party",
    includes: [
      "Both hands",
      "Customizable design style",
      "Group bookings welcome",
      "Natural henna",
    ],
    popular: false,
  },
  {
    id: "kids",
    name: "Kids Mehndi",
    emoji: "🌸",
    tagline: "Fun designs kids will adore",
    description:
      "We use specially tested, skin-safe natural henna for children. Designs include flowers, stars, hearts, butterflies, and other fun motifs that kids love. Quick application means no fidgeting!",
    price: 800,
    durationMin: 20,
    category: "Kids",
    includes: [
      "One hand (small design)",
      "Skin-safe natural henna",
      "Fun motifs",
      "Quick application",
    ],
    popular: false,
  },
];

function formatDuration(min: number): string {
  if (min < 60) return `${min} minutes`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h} hour${h > 1 ? "s" : ""}`;
}

export default function ServicesPage() {
  return (
    <div className="section">
      <div className="container-base">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Services & Pricing</h1>
          <p className="section-subtitle mx-auto">
            Transparent pricing, beautiful results. Every service uses 100% natural henna.
          </p>
        </div>

        {/* Service Cards */}
        <div className="space-y-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`card relative overflow-hidden border-2 ${
                service.popular ? "border-gold-400" : "border-transparent"
              }`}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Emoji + Name */}
                <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                  <span className="text-5xl">{service.emoji}</span>
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-burgundy-900">
                      {service.name}
                    </h2>
                    <p className="text-gold-600 text-xs italic">{service.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Includes */}
                  <details className="group">
                    <summary className="cursor-pointer text-burgundy-900 text-sm font-semibold flex items-center gap-1 list-none select-none">
                      <ArrowRight
                        size={14}
                        className="transition-transform group-open:rotate-90"
                      />
                      What&apos;s included
                    </summary>
                    <ul className="mt-3 space-y-1.5 pl-4">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle size={14} className="text-gold-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                {/* Price + Book */}
                <div className="md:text-right flex flex-row md:flex-col items-center md:items-end justify-between gap-3 md:w-44 flex-shrink-0">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Starting from</div>
                    <div className="font-playfair text-2xl font-bold text-burgundy-900">
                      INR {service.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 md:justify-end mt-1">
                      <Clock size={12} />
                      {formatDuration(service.durationMin)}
                    </div>
                  </div>
                  <Link
                    href={`/book?service=${service.id}`}
                    id={`book-${service.id}`}
                    className="btn-primary text-sm whitespace-nowrap"
                  >
                    Book This
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Group bookings note */}
        <div className="mt-8 p-5 bg-gold-50 border border-gold-200 rounded-2xl text-center">
          <p className="text-burgundy-900 font-medium">
            🎊 Group bookings for 5+ guests get special rates!{" "}
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || "923000000000").replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi! I'd like to inquire about group mehndi rates.")}`}
              className="text-gold-600 underline font-bold hover:text-gold-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>{" "}
            for a custom quote.
          </p>
        </div>
      </div>
    </div>
  );
}
