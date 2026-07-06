import type { Metadata } from "next";
import GalleryGrid from "@/components/public/GalleryGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse our gallery of stunning mehndi designs — bridal, Arabic, party, and kids henna art.",
};

export default function PortfolioPage() {
  return (
    <div className="section">
      <div className="container-base">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="section-title">Our Portfolio</h1>
          <p className="section-subtitle mx-auto">
            Every design tells a story. Browse our collection of bridal, Arabic, party, and kids mehndi art.
          </p>
        </div>
        <GalleryGrid />
      </div>
    </div>
  );
}
