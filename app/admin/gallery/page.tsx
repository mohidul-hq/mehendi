"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Trash2, Upload, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface GalleryImage {
  _id: string;
  url: string;
  category: string;
  caption?: string;
}

const CATEGORIES = ["Bridal", "Arabic", "Party", "Kids", "Other"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("Bridal");
  const [caption, setCaption] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  async function load() {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setUploading(true);

      for (const file of acceptedFiles) {
        try {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("category", category);
          fd.append("caption", caption);

          const res = await fetch("/api/gallery", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Upload failed");
          toast.success(`${file.name} uploaded`);
        } catch {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setUploading(false);
      setCaption("");
      load();
    },
    [category, caption]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  async function deleteImage(id: string) {
    if (!confirm("Delete this image permanently?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      toast.success("Image deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  }

  const filtered = filterCat === "All" ? images : images.filter((i) => i.category === filterCat);

  return (
    <div>
      <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900 mb-6">Gallery</h1>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Upload Images</h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Caption (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Bridal full-hand design"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-gold-500 bg-gold-50"
              : "border-cream-200 hover:border-gold-400 hover:bg-gold-50"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-gold-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={32} className="text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                {isDragActive ? "Drop images here" : "Drag & drop images or click to browse"}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP — max 10MB each</p>
            </div>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              filterCat === c
                ? "bg-burgundy-900 text-white border-burgundy-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-burgundy-900"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="columns-2 md:columns-4 gap-3 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={cn("skeleton break-inside-avoid rounded-xl", i % 3 === 0 ? "h-48" : "h-32")} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">
          No images in this category. Upload some using the form above!
        </div>
      ) : (
        <div className="columns-2 md:columns-4 gap-3 space-y-3">
          {filtered.map((img) => (
            <div key={img._id} className="break-inside-avoid relative group rounded-xl overflow-hidden">
              <Image
                src={img.url}
                alt={img.caption || img.category}
                width={300}
                height={200}
                className="w-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-start justify-end p-2">
                <button
                  onClick={() => deleteImage(img._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
