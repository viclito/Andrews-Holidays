import { Schema, model, models, type Document, type Model } from "mongoose";

export type CustomerUserType = Document & {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

const customerUserSchema = new Schema<CustomerUserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export const CustomerUser: Model<CustomerUserType> =
  models.CustomerUser || model<CustomerUserType>("CustomerUser", customerUserSchema);
