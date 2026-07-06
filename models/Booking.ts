import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBooking extends Document {
  customer: Types.ObjectId;
  service: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  venue?: string;
  guests?: number;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, default: "" },
    guests: { type: Number, default: 1 },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Index for fast conflict checks (date + time overlap queries)
BookingSchema.index({ date: 1, startTime: 1 });
BookingSchema.index({ status: 1, date: -1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
