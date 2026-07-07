import type { Metadata } from "next";
import Link from "next/link";
import { Star, Award, Heart, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Taslima",
  description:
    "Learn about Taslima, a professional mehndi artist with 10+ years of experience in bridal and decorative henna art.",
};

const badges = [
  { icon: Clock, value: "10+", label: "Years of Experience" },
  { icon: Heart, value: "500+", label: "Happy Clients" },
  { icon: Star, value: "5.0", label: "Average Rating" },
  { icon: Award, value: "100%", label: "Natural Henna" },
];

export default function AboutPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "923000000000";

  return (
    <div className="section">
      <div className="container-base max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title">About Taslima</h1>
          <p className="section-subtitle mx-auto">
            A passion for art, a dedication to craft.
          </p>
        </div>

        {/* Profile section */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Photo placeholder */}
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-burgundy-100 to-gold-100 flex-shrink-0 flex items-center justify-center text-6xl overflow-hidden">
              🌿
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-burgundy-900 mb-1">
                Taslima — Mehndi Artist
              </h2>
              <p className="text-gold-600 italic mb-4">
                Professional Mehndi Artist & Henna Specialist
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                With over a decade of experience in the art of mehndi, Taslima has adorned
                thousands of brides and clients with breathtaking henna designs. Her journey
                began as a young girl watching her grandmother trace delicate patterns on
                family members&apos; hands — a tradition she has since elevated into a full
                professional artistry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Specializing in traditional bridal designs, contemporary Arabic motifs, and
                everything in between, Taslima brings both technical precision and heartfelt
                creativity to every session. She uses only 100% natural henna — no chemicals,
                no shortcuts — ensuring vibrant color and skin safety for all clients.
              </p>
            </div>
          </div>
        </div>

        {/* Experience Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {badges.map(({ icon: Icon, value, label }) => (
            <div key={label} className="card text-center">
              <Icon size={28} className="text-gold-500 mx-auto mb-2" />
              <div className="font-playfair text-2xl font-bold text-burgundy-900">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Specializations */}
        <div className="card mb-8">
          <h3 className="font-playfair text-xl font-bold text-burgundy-900 mb-4">
            Specializations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "Bridal Mehndi", desc: "Full hands & feet with traditional Pakistani/Indian patterns" },
              { title: "Arabic Designs", desc: "Bold floral motifs with contemporary aesthetics" },
              { title: "Indo-Arabic Fusion", desc: "Blend of traditional and modern design elements" },
              { title: "Kids Henna", desc: "Fun, safe designs for children using tested natural henna" },
              { title: "Group Sessions", desc: "Dholkis, mehendi nights, corporate events" },
              { title: "Custom Designs", desc: "Personalized patterns crafted to your vision" },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 mt-2" />
                <div>
                  <div className="font-semibold text-burgundy-900 text-sm">{title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">Ready to experience the art of Taslima?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="btn-primary">
              Book an Appointment
            </Link>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi Taslima! I'd love to discuss my mehndi requirements.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              💬 Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
