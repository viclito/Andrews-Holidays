import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Booking } from "@/models/Booking";
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, rating, title, comment, images } = body;

    await dbConnect();

    // Verify booking belongs to user and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      // We check if the booking has a userId that matches.
      // Since we might not have userId on all bookings (legacy), we can also check email.
      // But for new system, userId is best.
      $or: [
        { userId: session.user.id },
        { "travellers.email": session.user.email }
      ]
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if journey is completed (endDate < now)
    if (new Date(booking.endDate) > new Date()) {
      return NextResponse.json(
        { error: "You can only review completed journeys" },
        { status: 400 }
      );
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this journey" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userId: session.user.id, // Assuming session has ID, if not we might need to look up User
      bookingId,
      packageId: booking.packageId,
      userName: session.user.name || "Traveler",
      userEmail: session.user.email,
      rating,
      title,
      comment,
      images: images || [],
      isApproved: false, // Requires admin approval
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
