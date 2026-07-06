"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Availability {
  _id: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  blockedDate?: string;
  isBlocked: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminAvailabilityPage() {
  const [slots, setSlots] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hours" | "blocked">("hours");

  // Form state for weekly hours
  const [hourForm, setHourForm] = useState({ dayOfWeek: 1, startTime: "09:00", endTime: "18:00" });
  // Form state for blocked date
  const [blockForm, setBlockForm] = useState({ blockedDate: "" });

  async function load() {
    try {
      const res = await fetch("/api/availability");
      const data = await res.json();
      setSlots(data.availability || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function addHours() {
    setSaving(true);
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hourForm, isBlocked: false }),
      });
      toast.success("Hours added");
      load();
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  }

  async function blockDate() {
    if (!blockForm.blockedDate) { toast.error("Select a date"); return; }
    setSaving(true);
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedDate: blockForm.blockedDate, isBlocked: true }),
      });
      toast.success("Date blocked");
      setBlockForm({ blockedDate: "" });
      load();
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    await fetch(`/api/availability/${id}`, { method: "DELETE" });
    toast.success("Removed");
    load();
  }

  const weeklyHours = slots.filter((s) => !s.isBlocked && s.dayOfWeek !== undefined);
  const blockedDates = slots.filter((s) => s.isBlocked && s.blockedDate);

  return (
    <div>
      <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900 mb-6">Availability</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["hours", "blocked"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium border transition-all",
              activeTab === tab
                ? "bg-burgundy-900 text-white border-burgundy-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-burgundy-900"
            )}
          >
            {tab === "hours" ? "🗓️ Weekly Hours" : "🚫 Block Dates"}
          </button>
        ))}
      </div>

      {activeTab === "hours" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Hours */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Add Working Hours</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Day of Week</label>
                <select
                  className="input"
                  value={hourForm.dayOfWeek}
                  onChange={(e) => setHourForm((p) => ({ ...p, dayOfWeek: Number(e.target.value) }))}
                >
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Time</label>
                  <input
                    type="time"
                    className="input"
                    value={hourForm.startTime}
                    onChange={(e) => setHourForm((p) => ({ ...p, startTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input
                    type="time"
                    className="input"
                    value={hourForm.endTime}
                    onChange={(e) => setHourForm((p) => ({ ...p, endTime: e.target.value }))}
                  />
                </div>
              </div>
              <button onClick={addHours} className="btn-primary w-full" disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add Hours
              </button>
            </div>
          </div>

          {/* Current Hours */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Current Schedule</h2>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="skeleton h-10 rounded-xl"/>)}</div>
            ) : weeklyHours.length === 0 ? (
              <p className="text-gray-400 text-sm">No hours set yet.</p>
            ) : (
              <div className="space-y-2">
                {weeklyHours.map((s) => (
                  <div key={s._id} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                    <div className="text-sm">
                      <span className="font-medium text-burgundy-900">{DAYS[s.dayOfWeek!]}</span>
                      <span className="text-gray-400 ml-2">{s.startTime} – {s.endTime}</span>
                    </div>
                    <button onClick={() => remove(s._id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "blocked" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Block a Date */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Block a Date</h2>
            <p className="text-sm text-gray-500 mb-4">
              Blocked dates will be greyed out in the booking calendar and cannot be selected by customers.
            </p>
            <div className="space-y-3">
              <div>
                <label className="label">Date to Block</label>
                <input
                  type="date"
                  className="input"
                  value={blockForm.blockedDate}
                  onChange={(e) => setBlockForm({ blockedDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <button onClick={blockDate} className="btn-primary w-full" disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : "🚫"}
                Block This Date
              </button>
            </div>
          </div>

          {/* Blocked Dates List */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Blocked Dates</h2>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="skeleton h-10 rounded-xl"/>)}</div>
            ) : blockedDates.length === 0 ? (
              <p className="text-gray-400 text-sm">No dates blocked.</p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((s) => (
                  <div key={s._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <span className="text-sm font-medium text-red-700">
                      🚫 {s.blockedDate ? new Date(s.blockedDate).toLocaleDateString("en-PK", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </span>
                    <button onClick={() => remove(s._id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
