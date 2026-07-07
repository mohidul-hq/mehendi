import Navbar from "@/components/public/Navbar";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    await connectToDatabase();
    // @ts-ignore
    const doc = await Settings.getSettings();
    settings = JSON.parse(JSON.stringify(doc));
  } catch (e) {
    console.error("Failed to load settings in layout", e);
  }

  const phone = settings?.phone || process.env.NEXT_PUBLIC_PHONE || "+91-300-000-0000";
  const socialLinks = settings?.socialLinks?.filter((l: any) => l.isActive) || [];
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      {/* Top padding for desktop nav, bottom padding for mobile nav */}
      <main className="md:pt-16 pb-24 md:pb-0">
        {children}
      </main>
      {/* Footer */}
      <footer className="hidden md:block bg-dark text-cream-50 py-12 mt-16">
        <div className="container-base">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-playfair text-2xl text-gold-400 mb-3">
                Taslima Mehendi Artist
              </h3>
              <p className="text-cream-200 text-sm leading-relaxed">
                Professional mehndi artist specializing in bridal, Arabic, party, and kids designs.
                Bringing the art of henna to life, one design at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gold-400 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-cream-200">
                {[
                  { href: "/portfolio", label: "Portfolio" },
                  { href: "/services", label: "Services" },
                  { href: "/book", label: "Book Now" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="hover:text-gold-400 transition-colors duration-200">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gold-400 mb-3">Get In Touch</h4>
              <ul className="space-y-2 text-sm text-cream-200">
                {phone && (
                  <li>
                    <a href={`tel:${phone}`} className="hover:text-gold-400 transition-colors">
                      📞 {phone}
                    </a>
                  </li>
                )}
                {socialLinks.map((link: any) => {
                  let href = link.url;
                  if (link.platform === "WhatsApp" && !href.startsWith("http")) {
                    href = `https://wa.me/${href}`;
                  } else if (link.platform === "Email" && !href.startsWith("mailto:")) {
                    href = `mailto:${href}`;
                  } else if (!href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
                    href = `https://${href}`;
                  }
                  
                  return (
                    <li key={link._id || link.platform}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold-400 transition-colors capitalize"
                      >
                        {link.platform === "WhatsApp" ? "💬" : link.platform === "Email" ? "✉️" : "🔗"} {link.platform}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-cream-300">
            © {new Date().getFullYear()} Taslima Mehendi Artist. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
