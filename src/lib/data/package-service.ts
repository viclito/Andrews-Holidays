import "server-only";
import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";
import { PackageType } from "@/models/Package";

export async function getFeaturedPackages(limit = 6) {
  await dbConnect();
  return Package.find({ isFeatured: true }).limit(limit).lean<PackageType[]>();
}

export async function getPackages(filters: {
  region?: string;
  duration?: number;
  maxPrice?: number;
}) {
  await dbConnect();
  const query: Record<string, unknown> = {};
  if (filters.region) query.region = filters.region;
  if (filters.duration) query.duration = { $gte: filters.duration };
  if (filters.maxPrice) query.priceFrom = { $lte: filters.maxPrice };

  return Package.find(query).sort({ createdAt: -1 }).lean<PackageType[]>();
}

export async function getPackageBySlug(slug: string) {
  await dbConnect();
  return Package.findOne({ slug }).lean<PackageType | null>();
}

