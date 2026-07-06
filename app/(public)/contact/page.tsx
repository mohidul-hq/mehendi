"use client";

import { useState, useEffect } from "react";
import { Phone, MessageCircle, Mail, MapPin, Send, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";

const PHONE = process.env.NEXT_PUBLIC_PHONE || "+923000000000";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "923000000000";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", message: "" });
  const [phone, setPhone] = useState(PHONE);
  const [whatsapp, setWhatsapp] = useState(WHATSAPP);
  const [whatsappActive, setWhatsappActive] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setPhone(data.settings.phone || PHONE);
          const waLink = data.settings.socialLinks?.find((l: any) => l.platform === "WhatsApp");
          if (waLink) {
            setWhatsapp(waLink.url);
            setWhatsappActive(waLink.isActive);
          } else {
            setWhatsappActive(false);
          }
        }
      } catch (e) {}
    }
    loadSettings();
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill in name, phone, and message");
      return;
    }
    setSubmitting(true);
    // Simulate sending — in production wire to email API
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: "", phone: "", email: "", message: "" });
    setSubmitting(false);
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.message) {
      toast.error("Please fill in your name and review");
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, rating }),
      });
      if (res.ok) {
        toast.success("Thank you for your review! It will appear after approval. 🌿");
        setReviewForm({ name: "", message: "" });
        setRating(5);
      } else {
        const data = await res.json();
        if (data.details?.fieldErrors) {
          const firstError = Object.values(data.details.fieldErrors)[0] as string[];
          toast.error(firstError[0] || "Validation failed. Please check your inputs.");
        } else {
          toast.error(data.error || "Failed to submit review. Please try again.");
        }
      }
    } catch {
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="section">
      <div className="container-base max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-subtitle mx-auto">
            Questions, bookings, or custom requests — we&apos;re always happy to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <a
            href={`tel:${phone}`}
            id="contact-call-btn"
            className="card flex flex-col items-center gap-3 text-center hover:border-burgundy-200 border-2 border-transparent transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center">
              <Phone size={22} className="text-burgundy-900" />
            </div>
            <div>
              <div className="font-semibold text-burgundy-900">Call Us</div>
              <div className="text-sm text-gray-500">{phone}</div>
            </div>
          </a>

          {whatsappActive && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Taslima! I have a question about your services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-whatsapp-btn"
              className="card flex flex-col items-center gap-3 text-center hover:border-green-200 border-2 border-transparent transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle size={22} className="text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-burgundy-900">WhatsApp</div>
                <div className="text-sm text-gray-500">Quick responses</div>
              </div>
            </a>
          )}

          <div className="card flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
              <MapPin size={22} className="text-gold-600" />
            </div>
            <div>
              <div className="font-semibold text-burgundy-900">Location</div>
              <div className="text-sm text-gray-500">Home visits available</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact Form */}
          <div className="card">
            <h2 className="font-playfair text-xl font-bold text-burgundy-900 mb-4">
              Send a Message
            </h2>
            <form onSubmit={handleContact} className="space-y-4">
              <div>
                <label className="label" htmlFor="contact-name">Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  className="input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="label" htmlFor="contact-phone">Phone *</label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="input"
                  placeholder="+92 300 0000000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  inputMode="tel"
                />
              </div>
              <div>
                <label className="label" htmlFor="contact-email">Email (optional)</label>
                <input
                  id="contact-email"
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  inputMode="email"
                />
              </div>
              <div>
                <label className="label" htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  className="input min-h-[100px] resize-none"
                  placeholder="Tell us about your requirements..."
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={4}
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Review Form */}
          <div id="review" className="card scroll-mt-20">
            <h2 className="font-playfair text-xl font-bold text-burgundy-900 mb-1">
              Leave a Review
            </h2>
            <p className="text-sm text-gray-500 mb-4">Reviews appear after approval.</p>

            <form onSubmit={handleReview} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="label">Your Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hoverRating || rating)
                            ? "text-gold-500 fill-gold-500"
                            : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label" htmlFor="review-name">Your Name *</label>
                <input
                  id="review-name"
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="review-message">Your Review *</label>
                <textarea
                  id="review-message"
                  className="input min-h-[100px] resize-none"
                  placeholder="Share your experience..."
                  value={reviewForm.message}
                  onChange={(e) => setReviewForm((p) => ({ ...p, message: e.target.value }))}
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? <Loader2 size={18} className="animate-spin" /> : "⭐"}
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Google Map embed */}
        <div className="card p-0 overflow-hidden rounded-2xl">
          <iframe
            title="Taslima Mehendi Artist Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108861.97093716671!2d74.24048!3d31.5497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1699000000000!5m2!1sen!2s"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
