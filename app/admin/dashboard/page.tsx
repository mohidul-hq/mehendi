"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn, getStatusColor } from "@/lib/utils";

interface BookingSummary {
  _id: string;
  status: string;
  date: string;
  startTime: string;
  customer?: { name: string; phone: string };
  service?: { name: string };
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  today: number;
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/bookings?limit=50");
        if (res.ok) {
          const { bookings: data } = await res.json();
          setBookings(data || []);

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59);

          setStats({
            total: data.length,
            pending: data.filter((b: BookingSummary) => b.status === "pending").length,
            confirmed: data.filter((b: BookingSummary) => b.status === "confirmed").length,
            today: data.filter((b: BookingSummary) => {
              const d = new Date(b.date);
              return d >= today && d <= todayEnd;
            }).length,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Today's Bookings", value: stats.today, icon: CalendarCheck, color: "bg-blue-50 text-blue-600" },
    { label: "Pending Confirm.", value: stats.pending, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "bg-green-50 text-green-600" },
    { label: "Total Bookings", value: stats.total, icon: TrendingUp, color: "bg-burgundy-50 text-burgundy-900" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
              <Icon size={20} />
            </div>
            <div className="font-playfair text-2xl font-bold text-gray-900">
              {loading ? "—" : value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No bookings yet.</p>
            <p className="text-gray-300 text-xs mt-1">Bookings will appear here when customers submit requests.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.slice(0, 10).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {(booking.customer as { name: string } | undefined)?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {(booking.service as { name: string } | undefined)?.name || "Service"} ·{" "}
                    {booking.date
                      ? format(new Date(booking.date), "MMM d")
                      : "—"}{" "}
                    at {booking.startTime}
                  </div>
                </div>
                <span className={cn("ml-3 text-xs px-2.5 py-1 rounded-full font-medium", getStatusColor(booking.status))}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { href: "/admin/bookings", label: "Manage Bookings", icon: "📅" },
          { href: "/admin/gallery", label: "Upload Photos", icon: "📸" },
          { href: "/admin/availability", label: "Set Availability", icon: "🗓️" },
          { href: "/admin/testimonials", label: "Review Queue", icon: "⭐" },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl p-4 text-center shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-xs font-medium text-gray-700">{label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
