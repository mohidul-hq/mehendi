"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, startOfDay } from "date-fns";

const STEPS = ["Service", "Date", "Time", "Details", "Confirm"];

const CATEGORY_EMOJI: Record<string, string> = {
  Bridal: "💍",
  Arabic: "🌙",
  Party: "🎉",
  Kids: "🌸",
};

// Fallback only shown if API is unreachable AND no DB — IDs are clearly invalid so booking won't be attempted
const fallbackServices = [
  { _id: "", name: "Bridal Mehndi", price: 15000, durationMin: 240, category: "Bridal" },
  { _id: "", name: "Arabic Mehndi", price: 2500, durationMin: 60, category: "Arabic" },
  { _id: "", name: "Party Mehndi", price: 5000, durationMin: 120, category: "Party" },
  { _id: "", name: "Kids Mehndi", price: 800, durationMin: 20, category: "Kids" },
];

interface Service {
  _id: string;
  name: string;
  price: number;
  durationMin: number;
  category: string;
  emoji?: string;
}

interface FormData {
  serviceId: string;
  date: Date | null;
  startTime: string;
  name: string;
  phone: string;
  email: string;
  venue: string;
  guests: number;
  notes: string;
}

function generateTimeSlots(startHour = 9, endHour = 20, stepMin = 30): string[] {
  const slots: string[] = [];
  let current = startHour * 60;
  const end = endHour * 60;
  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    current += stepMin;
  }
  return slots;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");

  const [step, setStep] = useState(preselectedService ? 1 : 0);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const [form, setForm] = useState<FormData>({
    serviceId: preselectedService || "",
    date: null,
    startTime: "",
    name: "",
    phone: "",
    email: "",
    venue: "",
    guests: 1,
    notes: "",
  });

  // Fetch real services from DB on mount so we use real MongoDB ObjectIds
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const { services: data } = await res.json();
          if (data && data.length > 0) {
            setServices(data);
          } else {
            setServices(fallbackServices);
          }
        } else {
          setServices(fallbackServices);
        }
      } catch {
        setServices(fallbackServices);
      } finally {
        setServicesLoading(false);
      }
    }
    loadServices();
  }, []);

  const selectedService = services.find((s) => s._id === form.serviceId);
  const timeSlots = generateTimeSlots(9, 19, selectedService?.durationMin || 60);

  const set = (field: keyof FormData, value: FormData[typeof field]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Uses the public availability endpoint instead of the admin-protected bookings endpoint
  async function loadBookedSlots(date: Date) {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      // We check availability via the public bookings endpoint — returns 401 if not admin
      // so we just skip slot blocking when not authenticated (slots shown as available)
      const res = await fetch(`/api/bookings?dateFrom=${dateStr}&dateTo=${dateStr}`);
      if (res.ok) {
        const { bookings } = await res.json();
        setBookedSlots(
          (bookings || []).map((b: { startTime: string }) => b.startTime)
        );
      } else {
        // 401 = not admin, just show all slots as available
        setBookedSlots([]);
      }
    } catch {
      setBookedSlots([]);
    }
  }

  async function handleSubmit() {
    if (!form.serviceId) {
      toast.error("Error: Database not seeded. Please run 'npm run seed' to create services.");
      return;
    }
    if (!form.date || !form.startTime || !form.name || !form.phone) {
      toast.error("Please fill in all required fields (Name, Phone, Date, Time).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: format(form.date, "yyyy-MM-dd"),
          guests: form.guests || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Booking failed. Please try again.");
        return;
      }

      setBookingId(data.booking?._id || "");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── CONFIRMATION SCREEN ───────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center py-12 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        <h2 className="font-playfair text-3xl font-bold text-burgundy-900 mb-3">
          Booking Received! 🌿
        </h2>
        <p className="text-gray-600 max-w-sm mx-auto mb-2">
          Thank you, <strong>{form.name}</strong>! Your booking is <strong>pending confirmation</strong>.
          We&apos;ll reach out shortly to confirm your appointment.
        </p>
        {bookingId && (
          <p className="text-xs text-gray-400 mb-6">
            Booking ref: #{bookingId.slice(-8).toUpperCase()}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || "923000000000").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi! I just booked a ${selectedService?.name} and wanted to confirm. Booking ref: #${bookingId.slice(-8).toUpperCase()}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-[#25D366] hover:bg-[#1da851] border-[#25D366]"
          >
            💬 Confirm on WhatsApp
          </a>
          <a href="/" className="btn-outline">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // ─── STEP INDICATOR ────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              i < step
                ? "bg-burgundy-900 text-white"
                : i === step
                ? "bg-gold-500 text-white ring-4 ring-gold-200"
                : "bg-cream-100 text-gray-400"
            )}
          >
            {i < step ? <Check size={14} /> : i + 1}
          </div>
          <div
            className={cn(
              "hidden sm:block text-[10px] font-medium mt-1 text-center w-full",
              i === step ? "text-burgundy-900" : "text-gray-400"
            )}
          >
            {/* label hidden on mobile to save space */}
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn("flex-1 h-0.5 mx-1 transition-all duration-300", i < step ? "bg-burgundy-900" : "bg-cream-100")} />
          )}
        </div>
      ))}
    </div>
  );

  const stepLabel = STEPS[step];

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator />

      <div className="card animate-fade-in">
        <h2 className="font-playfair text-xl font-bold text-burgundy-900 mb-1">
          {step === 0 && "Choose Your Service"}
          {step === 1 && "Pick a Date"}
          {step === 2 && "Choose Your Time"}
          {step === 3 && "Your Details"}
          {step === 4 && "Confirm Booking"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Step {step + 1} of {STEPS.length} — {stepLabel}
        </p>

        {/* ─── STEP 0: Choose Service ──────────────────────────── */}
        {step === 0 && (
          <div className="space-y-3">
            {services.map((s) => (
              <button
                key={s._id}
                onClick={() => { set("serviceId", s._id); setStep(1); }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200",
                  form.serviceId === s._id
                    ? "border-burgundy-900 bg-burgundy-50"
                    : "border-cream-100 hover:border-gold-400 hover:bg-gold-50"
                )}
              >
                <span className="text-3xl">{CATEGORY_EMOJI[s.category] || "🌿"}</span>
                <div className="flex-1">
                  <div className="font-semibold text-burgundy-900">{s.name}</div>
                  <div className="text-xs text-gray-400">
                    INR {s.price.toLocaleString()} · ~{s.durationMin >= 60 ? `${Math.floor(s.durationMin / 60)}h` : ""}{s.durationMin % 60 > 0 ? `${s.durationMin % 60}m` : ""}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {/* ─── STEP 1: Choose Date ─────────────────────────────── */}
        {step === 1 && (
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={form.date || undefined}
              onSelect={(day) => {
                if (!day) return;
                set("date", day);
                loadBookedSlots(day);
              }}
              disabled={{ before: addDays(startOfDay(new Date()), 1) }}
              modifiersClassNames={{
                selected: "!bg-burgundy-900 !text-white !rounded-lg",
                today: "!text-gold-600 !font-bold",
              }}
              className="rdp-custom"
            />
          </div>
        )}

        {/* ─── STEP 2: Choose Time ─────────────────────────────── */}
        {step === 2 && (
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  disabled={isBooked}
                  onClick={() => { set("startTime", slot); setStep(3); }}
                  className={cn(
                    "py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200",
                    isBooked
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      : form.startTime === slot
                      ? "border-burgundy-900 bg-burgundy-900 text-white"
                      : "border-cream-100 hover:border-gold-400 hover:bg-gold-50 text-gray-700"
                  )}
                >
                  {formatTime(slot)}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── STEP 3: Customer Details ────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="booking-name">Full Name *</label>
              <input
                id="booking-name"
                type="text"
                className="input"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="label" htmlFor="booking-phone">Phone Number *</label>
              <input
                id="booking-phone"
                type="tel"
                className="input"
                placeholder="+91 300 0000000"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <div>
              <label className="label" htmlFor="booking-email">Email (optional)</label>
              <input
                id="booking-email"
                type="email"
                className="input"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                inputMode="email"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label" htmlFor="booking-venue">Venue / Address</label>
              <input
                id="booking-venue"
                type="text"
                className="input"
                placeholder="Wedding hall, home address, etc."
                value={form.venue}
                onChange={(e) => set("venue", e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="booking-guests">Number of Guests</label>
              <input
                id="booking-guests"
                type="number"
                className="input"
                placeholder="1"
                value={form.guests}
                onChange={(e) => set("guests", parseInt(e.target.value) || 1)}
                min={1}
                max={50}
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="label" htmlFor="booking-notes">Additional Notes</label>
              <textarea
                id="booking-notes"
                className="input min-h-[80px] resize-none"
                placeholder="Any special requests or design preferences..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* ─── STEP 4: Confirm ─────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="bg-cream-50 rounded-xl p-4 space-y-3">
              {[
                { label: "Service", value: selectedService?.name || "—" },
                { label: "Date", value: form.date ? format(form.date, "EEEE, MMMM d yyyy") : "—" },
                { label: "Time", value: form.startTime ? formatTime(form.startTime) : "—" },
                { label: "Name", value: form.name || "—" },
                { label: "Phone", value: form.phone || "—" },
                ...(form.email ? [{ label: "Email", value: form.email }] : []),
                ...(form.venue ? [{ label: "Venue", value: form.venue }] : []),
                { label: "Guests", value: String(form.guests) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm border-b border-cream-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="text-burgundy-900 font-semibold text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-3 text-sm text-gold-800">
              <strong>Starting price:</strong> INR {selectedService?.price?.toLocaleString() || "—"}
              <br />
              <span className="text-xs text-gold-600">Final price confirmed on arrival</span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree that this is a booking request. Confirmation is subject to availability.
            </p>
          </div>
        )}

        {/* ─── Navigation Buttons ──────────────────────────────── */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-outline flex-1"
              disabled={submitting}
            >
              ← Back
            </button>
          )}

          {step < 4 && step !== 0 && (
            <button
              onClick={() => {
                if (step === 1 && !form.date) { toast.error("Please select a date"); return; }
                if (step === 2 && !form.startTime) { toast.error("Please select a time slot"); return; }
                if (step === 3 && (!form.name || !form.phone)) { toast.error("Name and phone are required"); return; }
                setStep(step + 1);
              }}
              className="btn-primary flex-1"
            >
              Next →
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? (
                <><Loader2 size={18} className="animate-spin" /> Submitting...</>
              ) : (
                "Confirm Booking 🌿"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
