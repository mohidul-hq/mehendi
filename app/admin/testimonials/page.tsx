"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Testimonial {
  _id: string;
  name: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  async function load() {
    try {
      const res = await fetch("/api/testimonials?all=true");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function update(id: string, approved: boolean) {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      toast.success(approved ? "Review approved ✅" : "Review rejected");
      load();
    } catch { toast.error("Failed"); }
  }

  async function del(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  }

  const filtered = testimonials.filter((t) => {
    if (filter === "pending") return !t.approved;
    if (filter === "approved") return t.approved;
    return true;
  });

  const pendingCount = testimonials.filter((t) => !t.approved).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900">Testimonials</h1>
        {pendingCount > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition-all",
              filter === f
                ? "bg-burgundy-900 text-white border-burgundy-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-burgundy-900"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl text-gray-400">
          <Star size={40} className="mx-auto mb-3 text-gray-200" />
          <p>No reviews in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <div
              key={t._id}
              className={cn(
                "bg-white rounded-2xl shadow-card p-5 border-l-4",
                t.approved ? "border-green-400" : "border-yellow-400"
              )}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-burgundy-900">{t.name}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      t.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {t.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? "text-gold-500 fill-gold-500" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm italic">&ldquo;{t.message}&rdquo;</p>
                  <p className="text-xs text-gray-300 mt-2">
                    {t.createdAt ? format(new Date(t.createdAt), "MMM d, yyyy") : ""}
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 flex-wrap mt-3 sm:mt-0">
                  {!t.approved && (
                    <button
                      onClick={() => update(t._id, true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  {t.approved && (
                    <button
                      onClick={() => update(t._id, false)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-medium hover:bg-yellow-100 transition-colors"
                    >
                      <XCircle size={14} /> Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => del(t._id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
