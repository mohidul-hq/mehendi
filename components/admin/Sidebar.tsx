"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Images,
  Clock,
  Star,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/availability", label: "Availability", icon: Clock },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/admins", label: "Admins", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <div>
            <div className="font-playfair font-bold text-white text-sm">Taslima Mehendi</div>
            <div className="text-cream-300 text-xs">Admin Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gold-500 text-white shadow-gold"
                  : "text-cream-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream-300 hover:bg-white/10 hover:text-white transition-all"
        >
          🌐 View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-burgundy-900 fixed top-0 left-0 bottom-0 z-50">
        <NavContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-burgundy-900 flex items-center justify-between px-4 h-14 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="font-playfair font-bold text-white text-sm">Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-gold-400 hover:text-gold-300">
            <span className="text-xs font-semibold uppercase tracking-wider">Site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-red-300 hover:text-red-200"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-burgundy-900 border-t border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex items-center overflow-x-auto no-scrollbar px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 min-w-[72px] px-2 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-gold-400"
                    : "text-cream-300 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={isActive ? 22 : 20} className={isActive ? "scale-110 transition-transform" : ""} />
                <span className="text-[10px] font-medium mt-0.5">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
