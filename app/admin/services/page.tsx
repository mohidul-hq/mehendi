"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  category: string;
  imageUrl?: string;
  active: boolean;
}

const CATEGORIES = ["Bridal", "Arabic", "Party", "Kids"];
const EMOJIS: Record<string, string> = { Bridal: "💍", Arabic: "🌙", Party: "🎉", Kids: "🌸" };

const empty = { name: "", description: "", price: 0, durationMin: 60, category: "Bridal", imageUrl: "", active: true };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(empty); setModal(true); }
  function openEdit(s: Service) { setEditing(s); setForm({ ...s, imageUrl: s.imageUrl || "" }); setModal(true); }
  function closeModal() { setModal(false); setEditing(null); }

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSave() {
    if (!form.name?.trim()) {
      toast.error("Please enter a service name");
      return;
    }
    if (!form.description?.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (isNaN(form.price) || form.price < 0) {
      toast.error("Please enter a valid price (0 or greater)");
      return;
    }
    if (isNaN(form.durationMin) || form.durationMin < 15) {
      toast.error("Duration must be at least 15 minutes");
      return;
    }
    setSaving(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const url = editing ? `/api/services/${editing._id}` : "/api/services";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), durationMin: Number(form.durationMin) }),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Service updated" : "Service created");
      closeModal();
      load();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  }

  async function toggleActive(s: Service) {
    await fetch(`/api/services/${s._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900">Services</h1>
        <button onClick={openNew} className="btn-primary text-sm sm:w-auto w-full">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl shadow-card p-4 md:p-5 flex flex-col sm:flex-row items-start gap-4">
              <span className="text-4xl flex-shrink-0">{EMOJIS[s.category] || "🌿"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-burgundy-900">{s.name}</h3>
                    <span className="text-xs bg-cream-100 text-burgundy-700 px-2 py-0.5 rounded-full">{s.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-burgundy-900">INR {s.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{s.durationMin >= 60 ? `${Math.floor(s.durationMin / 60)}h ${s.durationMin % 60 > 0 ? s.durationMin % 60 + "m" : ""}`.trim() : `${s.durationMin}min`}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => openEdit(s)} className="btn-ghost text-xs px-3 py-1.5 min-h-0">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => toggleActive(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all min-h-0 ${s.active ? "bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700" : "bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-700"}`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 min-h-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">
              No services yet. Add your first service!
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-in-bottom">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-playfair text-xl font-bold text-burgundy-900">
                {editing ? "Edit Service" : "New Service"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Service Name *</label>
                <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Bridal Full Package" />
              </div>
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input min-h-[80px] resize-none" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Price (INR) *</label>
                  <input className="input" type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} min={0} inputMode="numeric" />
                </div>
                <div>
                  <label className="label">Duration (min) *</label>
                  <input className="input" type="number" value={form.durationMin} onChange={(e) => set("durationMin", Number(e.target.value))} min={15} inputMode="numeric" />
                </div>
              </div>
              <div>
                <label className="label">Image URL (optional)</label>
                <input className="input" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="service-active"
                  checked={form.active}
                  onChange={(e) => set("active", e.target.checked)}
                  className="w-4 h-4 accent-burgundy-900"
                />
                <label htmlFor="service-active" className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="btn-primary flex-1" disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? "Saving..." : editing ? "Update Service" : "Create Service"}
              </button>
              <button onClick={closeModal} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
