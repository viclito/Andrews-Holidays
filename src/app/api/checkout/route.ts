import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { auth } from "@/auth";

import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";
import { Booking } from "@/models/Booking";

const checkoutSchema = z.object({
  packageId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  travellers: z.coerce.number().min(1).max(8),
  contactName: z.string().min(3),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  specialRequests: z.string().optional(),
});

export async function POST(request: Request) {
  // Stripe check removed
  const session = await auth();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "App URL missing (NEXT_PUBLIC_APP_URL)" },
      { status: 500 }
    );
  }

  try {
    const json = await request.json();
    const data = checkoutSchema.parse(json);

    // Date Validation
    const start = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return NextResponse.json({ error: "Start date cannot be in the past" }, { status: 400 });
    }

    await dbConnect();
    const query = isValidObjectId(data.packageId)
      ? { _id: data.packageId }
      : { slug: data.packageId };

    const pkg = await Package.findOne(query);

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Direct booking creation (Stripe bypassed)
    const total = pkg.priceFrom * data.travellers;
    
    const booking = await Booking.create({
      userId: session?.user?.id, // Link booking to user
      packageId: pkg._id,
      packageTitle: pkg.title,
      startDate: data.startDate,
      endDate: data.endDate,
      travellers: [
        {
          fullName: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone,
          nationality: "IN", 
        },
      ],
      totalAmount: total,
      currency: "INR",
      status: "pending", // Pending payment/confirmation
      specialRequests: data.specialRequests,
    });

    // Notify Admins
    const { getAdminEmails } = await import("@/lib/admin-utils");
    const { notifyAdmins } = await import("@/lib/notifications");
    const adminEmails = await getAdminEmails();

    await notifyAdmins({
      recipients: adminEmails,
      subject: `New Booking: ${pkg.title}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Package:</strong> ${pkg.title}</p>
        <p><strong>Customer:</strong> ${data.contactName}</p>
        <p><strong>Email:</strong> ${data.contactEmail}</p>
        <p><strong>Phone:</strong> ${data.contactPhone}</p>
        <p><strong>Dates:</strong> ${data.startDate} to ${data.endDate}</p>
        <p><strong>Travellers:</strong> ${data.travellers}</p>
        <p><strong>Total:</strong> ${total} INR</p>
        ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ""}
        <br/>
        <p>Please login to the dashboard to approve or reject this booking.</p>
      `,
    });

    return NextResponse.json({ url: `${baseUrl}/booking/confirmation?bookingId=${booking._id}` });

  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 }
    );
  }
}



