import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLink {
  _id?: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export interface ISettings extends Document {
  singletonId: string;
  phone: string;
  socialLinks: ISocialLink[];
}

const settingsSchema = new Schema<ISettings>(
  {
    singletonId: { type: String, default: "global", unique: true },
    phone: { type: String, default: "" },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

// We need a helper to ensure only one document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ singletonId: "global" });
  if (!settings) {
    settings = await this.create({
      singletonId: "global",
      phone: "+91 300 000 0000",
      socialLinks: [
        { platform: "WhatsApp", url: "913000000000", isActive: true },
        { platform: "Instagram", url: "https://instagram.com/taslimamehendi", isActive: true },
      ],
    });
  }
  return settings;
};

// Ensure no model recompilation error in dev
const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
