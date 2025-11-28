import { Schema, model, models, type Document, type Model } from "mongoose";

export type InquiryType = Document & {
  userId?: Schema.Types.ObjectId;
  packageId?: Schema.Types.ObjectId;
  packageTitle?: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "contacted" | "converted";
};

const inquirySchema = new Schema<InquiryType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "CustomerUser" },
    packageId: { type: Schema.Types.ObjectId, ref: "Package" },
    packageTitle: String,
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const Inquiry: Model<InquiryType> =
  models.Inquiry || model<InquiryType>("Inquiry", inquirySchema);

