"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Images, CalendarCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/portfolio", label: "Portfolio", icon: Images },
  { href: "/book", label: "Book Now", icon: CalendarCheck, highlight: true },
  { href: "/contact", label: "Contact", icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* WhatsApp FAB */}
      <WhatsAppButton />

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav md:hidden" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {navItems.map(({ href, label, icon: Icon, highlight }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 min-w-[60px]",
                  highlight
                    ? isActive
                      ? "bg-burgundy-900 text-white"
                      : "bg-gold-500 text-white shadow-gold"
                    : isActive
                    ? "text-burgundy-900"
                    : "text-gray-400"
                )}
              >
                <Icon
                  size={22}
                  className={cn(
                    "transition-transform duration-200",
                    isActive && !highlight && "scale-110"
                  )}
                />
                <span className="text-[11px] font-semibold leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-cream-100">
        <div className="container-base flex items-center justify-between h-16">
          <Link href="/" className="font-playfair text-xl font-bold text-gradient">
            Taslima Mehendi
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, highlight }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    highlight
                      ? "btn-gold ml-2"
                      : isActive
                      ? "text-burgundy-900 bg-burgundy-50"
                      : "text-gray-600 hover:text-burgundy-900 hover:bg-cream-50"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
