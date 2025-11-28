import { Schema, model, models, type Document, type Model } from "mongoose";

export type ReviewType = Document & {
  userId: Schema.Types.ObjectId;
  bookingId: Schema.Types.ObjectId;
  packageId: Schema.Types.ObjectId;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const reviewSchema = new Schema<ReviewType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "CustomerUser", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    images: [{ type: String }],
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review: Model<ReviewType> =
  models.Review || model<ReviewType>("Review", reviewSchema);
