import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";

const updateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  region: z.string().optional(),
  duration: z.number().optional(),
  priceFrom: z.number().optional(),
  summary: z.string().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  itinerary: z.array(z.any()).optional(),
  isFeatured: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const json = await request.json();
    const payload = updateSchema.parse({
      ...json,
      duration: json.duration ? Number(json.duration) : undefined,
      priceFrom: json.priceFrom ? Number(json.priceFrom) : undefined,
    });
    await dbConnect();
    const updated = await Package.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update package" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  await Package.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

