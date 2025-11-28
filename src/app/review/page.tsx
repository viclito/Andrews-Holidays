import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Review } from "@/models/Review";
import { ReviewForm } from "@/components/forms/ReviewForm";

export default async function ReviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/customer/login?callbackUrl=/review");
  }

  await dbConnect();

  // Find completed bookings for this user
  const completedBookings = await Booking.find({
    userId: session.user.id,
    status: "confirmed",
    endDate: { $lt: new Date() },
  }).select("packageTitle endDate");

  // Find existing reviews by this user to exclude them
  const existingReviews = await Review.find({
    userId: session.user.id,
  }).select("bookingId");

  const reviewedBookingIds = new Set(
    existingReviews.map((r) => r.bookingId.toString())
  );

  const reviewableBookings = completedBookings
    .filter((b) => !reviewedBookingIds.has(b._id.toString()))
    .map((b) => ({
      _id: b._id.toString(),
      packageTitle: b.packageTitle,
      endDate: b.endDate.toISOString(),
    }));

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-display font-semibold text-gray-900">
              Share Your Experience
            </h1>
            <p className="text-lg text-gray-600">
              Your stories inspire others to explore. Tell us about your journey.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
            <ReviewForm bookings={reviewableBookings} />
          </div>
        </div>
      </div>
    </div>
  );
}
