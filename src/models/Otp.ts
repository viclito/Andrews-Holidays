import { Schema, model, models, type Document, type Model } from "mongoose";

export type OtpType = Document & {
  email: string;
  otp: string;
  expiresAt: Date;
};

const otpSchema = new Schema<OtpType>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp: Model<OtpType> =
  models.Otp || model<OtpType>("Otp", otpSchema);
