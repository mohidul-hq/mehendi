"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn, getStatusColor } from "@/lib/utils";
import { Loader2, Trash2, CheckCircle, XCircle, Plus, Phone, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  date: string;
  startTime: string;
  endTime: string;
  venue?: string;
  guests?: number;
  notes?: string;
  customer?: { name: string; phone: string; email?: string };
  service?: { name: string; price: number };
  createdAt: string;
}

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "100" });
      if (statusFilter !== "all") qs.set("status", statusFilter);
      
      const res = await fetch(`/api/bookings?${qs.toString()}`);
      if (!res.ok) throw new Error("Fetch failed");
      
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  async function updateStatus(id: string, status: string) {
    setActionLoading(true);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success(`Booking ${status}`);
      setSelected(null);
      load();
    } catch {
      toast.error("Failed to update");
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      toast.success("Booking deleted");
      setSelected(null);
      load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900">Bookings</h1>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition-all",
              statusFilter === s
                ? "bg-burgundy-900 text-white border-burgundy-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-burgundy-900"
            )}
          >
            {s === "all" ? "All Bookings" : s}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <p>No bookings found for this filter.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Date & Time</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelected(b)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{b.customer?.name || "—"}</div>
                        <div className="text-xs text-gray-400">{b.customer?.phone || ""}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.service?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{b.date ? format(new Date(b.date), "MMM d, yyyy") : "—"}</div>
                        <div className="text-xs text-gray-400">{b.startTime} – {b.endTime}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium capitalize", getStatusColor(b.status))}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {b.status === "pending" && (
                            <button
                              onClick={() => updateStatus(b._id, "confirmed")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {(b.status === "pending" || b.status === "confirmed") && (
                            <button
                              onClick={() => updateStatus(b._id, "cancelled")}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          <a
                            href={`tel:${b.customer?.phone}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Call customer"
                          >
                            <Phone size={16} />
                          </a>
                          <button
                            onClick={() => deleteBooking(b._id)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-50">
              {bookings.map((b) => (
                <div 
                  key={b._id} 
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelected(b)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900 text-base">{b.customer?.name || "—"}</div>
                      <div className="text-xs text-gray-500">{b.customer?.phone || ""}</div>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium capitalize", getStatusColor(b.status))}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium mb-1">{b.service?.name || "—"}</div>
                  <div className="text-xs text-gray-500">
                    {b.date ? format(new Date(b.date), "MMM d, yyyy") : "—"} at {b.startTime}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-in-bottom">
            <h3 className="font-playfair text-xl font-bold text-burgundy-900 mb-4">Booking Details</h3>
            <div className="space-y-2 text-sm mb-5">
              {[
                ["Customer", selected.customer?.name],
                ["Phone", selected.customer?.phone],
                ["Email", selected.customer?.email],
                ["Service", selected.service?.name],
                ["Date", selected.date ? format(new Date(selected.date), "EEEE, MMMM d yyyy") : "—"],
                ["Time", `${selected.startTime} – ${selected.endTime}`],
                ["Venue", selected.venue],
                ["Guests", selected.guests?.toString()],
                ["Notes", selected.notes],
                ["Status", selected.status],
                ["Booked", selected.createdAt ? format(new Date(selected.createdAt), "MMM d, yyyy h:mm a") : "—"],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-900 font-medium capitalize text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {selected.status === "pending" && (
                <button
                  onClick={() => updateStatus(selected._id, "confirmed")}
                  className="btn-primary flex-1 text-sm py-2.5 bg-green-600 hover:bg-green-700 border-green-600"
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Confirm
                </button>
              )}
              {selected.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(selected._id, "completed")}
                  className="btn-primary flex-1 text-sm py-2.5"
                  disabled={actionLoading}
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="btn-outline flex-1 text-sm py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
