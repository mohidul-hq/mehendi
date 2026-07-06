import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  durationMin: number;
  category: "Bridal" | "Arabic" | "Party" | "Kids";
  imageUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    durationMin: { type: Number, required: true, min: 15 },
    category: {
      type: String,
      enum: ["Bridal", "Arabic", "Party", "Kids"],
      required: true,
    },
    imageUrl: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
