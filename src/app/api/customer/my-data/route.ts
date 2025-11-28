import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Inquiry } from "@/models/Inquiry";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const [bookings, inquiries] = await Promise.all([
      Booking.find({ userId: session.user.id })
        .populate("packageId")
        .sort({ createdAt: -1 })
        .lean(),
      Inquiry.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({ bookings, inquiries });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
