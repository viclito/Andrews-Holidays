import { stripe } from "@/lib/stripe";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

type ConfirmationProps = {
  searchParams: Promise<{ session_id?: string; bookingId?: string }>;
};

export const metadata = buildMetadata({
  title: "Booking confirmation",
});

export default async function BookingConfirmationPage({
  searchParams,
}: ConfirmationProps) {
  const params = await searchParams;
  const { session_id: sessionId, bookingId } = params;
  
  let bookingSummary: {
    email?: string | null;
    amount?: number | null;
    currency?: string | null;
  } | null = null;

  if (bookingId) {
    await dbConnect();
    const booking = await Booking.findById(bookingId);
    if (booking) {
      bookingSummary = {
        email: booking.travellers[0]?.email,
        amount: booking.totalAmount,
        currency: booking.currency,
      };
    }
  } else if (sessionId && stripe) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    bookingSummary = {
      email: session.customer_email,
      amount: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency?.toUpperCase(),
    };
  }

  return (
    <div className="space-y-6 text-center">
      <p className="section-heading">Booking Received</p>
      <h1 className="font-display text-5xl text-midnight">
        Your booking is pending approval.
      </h1>
      {bookingSummary ? (
        <div className="mx-auto max-w-lg rounded-[28px] border border-slate-100 bg-white p-8 shadow-soft">
          <p className="text-sm text-slate-500">Confirmation sent to</p>
          <p className="text-lg font-semibold text-midnight">{bookingSummary.email}</p>
          <p className="mt-4 text-sm text-slate-500">Estimated Amount</p>
          <p className="text-3xl font-display text-primary-600">
            {bookingSummary.amount} {bookingSummary.currency}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Our team will review your booking and contact you shortly for confirmation.
          </p>
        </div>
      ) : (
        <p className="text-slate-600">
          We could not retrieve the session details but if your booking succeeded,
          the concierge team will email you shortly.
        </p>
      )}
      <div className="flex justify-center gap-4">
        <Link href="/packages" className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white">
          Explore more packages
        </Link>
        <Link href="/customer/dashboard" className="rounded-full border border-primary-100 px-5 py-3 text-sm font-semibold text-primary-600">
          View booking dashboard
        </Link>
        <Link href="/review" className="rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
          Leave a Review
        </Link>
      </div>
    </div>
  );
}


