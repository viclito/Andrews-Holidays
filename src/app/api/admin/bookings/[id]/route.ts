import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export async function PATCH(
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
    const payload = statusSchema.parse(json);
    await dbConnect();
    const updated = await Booking.findByIdAndUpdate(
      id,
      { status: payload.status },
      { new: true }
    );

    // Send email notification
    if (updated && process.env.RESEND_API_KEY) {
      // Find the primary email (first traveller)
      const primaryEmail = updated.travellers?.[0]?.email;
      const primaryName = updated.travellers?.[0]?.fullName || "Traveller";

      if (primaryEmail) {
        console.log(`Attempting to send booking update email to: ${primaryEmail}`);
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const { data, error } = await resend.emails.send({
            from: "Andrews Holiday Updates <onboarding@resend.dev>",
            to: primaryEmail,
            subject: `Update on your booking: ${updated.packageTitle}`,
            html: `
              <h2>Hello ${primaryName},</h2>
              <p>The status of your booking for <strong>${updated.packageTitle}</strong> has been updated.</p>
              <p><strong>New Status:</strong> ${payload.status.charAt(0).toUpperCase() + payload.status.slice(1)}</p>
              <br/>
              <p>If you have any questions, please reply to this email.</p>
              <p>Best regards,<br/>Andrews Holiday Team</p>
            `,
          });

          if (error) {
            console.error("Resend API returned error:", error);
          } else {
            console.log("Resend API success:", data);
          }
        } catch (emailError) {
          console.error("Failed to send status update email (exception):", emailError);
        }
      } else {
        console.log("Skipping email: No primary email found in booking");
      }
    } else {
      console.log("Skipping email: updated object missing or RESEND_API_KEY missing");
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to update booking" }, { status: 500 });
  }
}

