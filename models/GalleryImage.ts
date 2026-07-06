import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryImage extends Document {
  url: string;
  publicId: string;
  category: string;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    category: {
      type: String,
      enum: ["Bridal", "Arabic", "Party", "Kids", "Other"],
      default: "Other",
    },
    caption: { type: String, default: "" },
  },
  { timestamps: true }
);

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
