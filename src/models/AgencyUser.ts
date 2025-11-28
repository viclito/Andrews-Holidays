import { Schema, model, models, type Document, type Model } from "mongoose";

export type AgencyUserType = Document & {
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor";
};

const agencyUserSchema = new Schema<AgencyUserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor",
    },
  },
  { timestamps: true }
);

export const AgencyUser: Model<AgencyUserType> =
  models.AgencyUser || model<AgencyUserType>("AgencyUser", agencyUserSchema);

