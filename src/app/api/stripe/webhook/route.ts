import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const payload = metadata.bookingPayload
      ? JSON.parse(metadata.bookingPayload)
      : null;

    if (payload) {
      await dbConnect();
      const total =
        typeof session.amount_total === "number" ? session.amount_total / 100 : 0;
      await Booking.create({
        packageId: payload.packageId,
        packageTitle: payload.packageTitle,
        startDate: payload.startDate,
        endDate: payload.endDate,
        travellers: [
          {
            fullName: payload.contactName,
            email: payload.contactEmail,
            phone: payload.contactPhone,
            nationality: "IN",
          },
        ],
        totalAmount: total || payload.priceFrom * payload.travellers,
        currency: session.currency?.toUpperCase() ?? "INR",
        status: "confirmed",
        paymentIntentId: session.payment_intent?.toString(),
        specialRequests: payload.specialRequests,
      });
    }
  }

  return NextResponse.json({ received: true });
}

