"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        const waLink = data.settings?.socialLinks?.find((l: any) => l.platform === "WhatsApp" && l.isActive);
        if (waLink) {
          setWhatsapp(waLink.url);
        }
      } catch (e) {}
    }
    load();
  }, []);

  if (!whatsapp) return null; // Hide if inactive or not found

  const message = encodeURIComponent(
    "Hi Taslima! I'd like to inquire about your mehndi services. 🌿"
  );

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-fab"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-4 z-50 md:bottom-8 
                 w-14 h-14 bg-[#25D366] rounded-full 
                 flex items-center justify-center
                 shadow-lg hover:shadow-xl hover:scale-110
                 transition-all duration-200 animate-float"
    >
      <MessageCircle size={28} className="text-white" fill="white" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </a>
  );
}
