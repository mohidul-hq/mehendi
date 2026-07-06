import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAvailability extends Document {
  dayOfWeek?: number; // 0=Sun, 1=Mon ... 6=Sat
  startTime?: string;
  endTime?: string;
  blockedDate?: Date;
  isBlocked: boolean;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    dayOfWeek: { type: Number, min: 0, max: 6 },
    startTime: { type: String },
    endTime: { type: String },
    blockedDate: { type: Date },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Availability: Model<IAvailability> =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;
