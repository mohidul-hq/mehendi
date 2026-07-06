"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { cn } from "@/lib/utils";

const categories = ["All", "Bridal", "Arabic", "Party", "Kids"];

// Placeholder images for when no DB is connected
const placeholderImages = [
  { _id: "1", url: "https://images.unsplash.com/photo-1591030617079-38fd05cb8fd0?w=600&q=80", category: "Bridal", caption: "Bridal full-hand design" },
  { _id: "2", url: "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=600&q=80", category: "Arabic", caption: "Arabic floral pattern" },
  { _id: "3", url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80", category: "Bridal", caption: "Intricate bridal design" },
  { _id: "4", url: "https://images.unsplash.com/photo-1543854680-af4a4d847462?w=600&q=80", category: "Party", caption: "Party mehndi" },
  { _id: "5", url: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&q=80", category: "Arabic", caption: "Arabic motifs" },
  { _id: "6", url: "https://images.unsplash.com/photo-1566159266057-5e8abef8fe54?w=600&q=80", category: "Kids", caption: "Kids design" },
];

interface GalleryImage {
  _id: string;
  url: string;
  category: string;
  caption?: string;
}

export default function GalleryGrid() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const { images: data } = await res.json();
          setImages(data?.length > 0 ? data : placeholderImages);
        } else {
          setImages(placeholderImages);
        }
      } catch {
        setImages(placeholderImages);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const lightboxSlides = filtered.map((img) => ({ src: img.url, title: img.caption }));

  return (
    <div>
      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border",
              activeCategory === cat
                ? "bg-burgundy-900 text-white border-burgundy-900"
                : "bg-white text-gray-600 border-cream-200 hover:border-burgundy-900 hover:text-burgundy-900"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn("skeleton w-full break-inside-avoid rounded-xl", i % 3 === 0 ? "h-64" : "h-44")}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {filtered.map((image, index) => (
              <div
                key={image._id}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={image.url}
                  alt={image.caption || `${image.category} mehndi design`}
                  width={400}
                  height={300}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-burgundy-900/0 group-hover:bg-burgundy-900/40 transition-all duration-300 flex items-end">
                  <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {image.caption && (
                      <p className="text-white text-xs font-medium">{image.caption}</p>
                    )}
                    <span className="inline-block mt-1 bg-gold-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              No images in this category yet.
            </div>
          )}

          {/* Lightbox */}
          <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={lightboxSlides}
          />
        </>
      )}
    </div>
  );
}
