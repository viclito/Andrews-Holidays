import { Schema, model, models, type Document, type Model } from "mongoose";

export type Traveller = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
};

export type BookingType = Document & {
  userId?: Schema.Types.ObjectId;
  packageId: Schema.Types.ObjectId;
  packageTitle: string;
  startDate: Date;
  endDate: Date;
  travellers: Traveller[];
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentIntentId?: string;
  specialRequests?: string;
  remindersSent: string[];
};

const travellerSchema = new Schema<Traveller>(
  {
    fullName: String,
    email: String,
    phone: String,
    nationality: String,
  },
  { _id: false }
);

const bookingSchema = new Schema<BookingType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "CustomerUser" },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    packageTitle: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travellers: [travellerSchema],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentIntentId: String,
    specialRequests: String,
    remindersSent: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Booking: Model<BookingType> =
  models.Booking || model<BookingType>("Booking", bookingSchema);

