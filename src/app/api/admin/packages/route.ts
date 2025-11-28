import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";

const packageSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  region: z.string(),
  duration: z.number().min(1),
  priceFrom: z.number().min(1000),
  summary: z.string().min(20),
  heroImage: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const packages = await Package.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const data = packageSchema.parse({
      ...json,
      heroImage: json.heroImage || "/images/placeholder.svg",
      duration: Number(json.duration),
      priceFrom: Number(json.priceFrom),
    });

    await dbConnect();
    const created = await Package.create({
      ...data,
      tags: json.tags ?? [],
      inclusions: json.inclusions ?? [],
      exclusions: json.exclusions ?? [],
      itinerary: json.itinerary ?? [],
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to create package" }, { status: 500 });
  }
}

