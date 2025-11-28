import { Schema, model, models, type Document, type Model } from "mongoose";

export type DayPlan = {
  day: number;
  title: string;
  description: string;
  highlights: string[];
};

export type PackageType = Document & {
  title: string;
  slug: string;
  heroImage: string;
  gallery: string[];
  region: string;
  duration: number;
  priceFrom: number;
  rating: number;
  tags: string[];
  summary: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: DayPlan[];
  isFeatured: boolean;
};

const dayPlanSchema = new Schema<DayPlan>(
  {
    day: Number,
    title: String,
    description: String,
    highlights: [String],
  },
  { _id: false }
);

const packageSchema = new Schema<PackageType>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    region: { type: String, required: true },
    duration: { type: Number, required: true },
    priceFrom: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    tags: [{ type: String }],
    summary: { type: String, required: true },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [dayPlanSchema],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Package: Model<PackageType> =
  models.Package || model<PackageType>("Package", packageSchema);

