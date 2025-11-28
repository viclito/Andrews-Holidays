import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { getAdminEmails } from "@/lib/admin-utils";
import { notifyAdmins } from "@/lib/notifications";

export const dynamic = "force-dynamic"; // Ensure this route is not cached

export async function GET(request: Request) {
  // Verify cron secret if needed (optional for now as per user request context)
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    await dbConnect();
    const adminEmails = await getAdminEmails();

    if (adminEmails.length === 0) {
      return NextResponse.json({ message: "No admins to notify" });
    }

    // Find pending bookings starting soon
    const now = new Date();
    const pendingBookings = await Booking.find({
      status: "pending",
      startDate: { $gt: now }, // Only future bookings
    });

    let emailsSent = 0;

    for (const booking of pendingBookings) {
      const startDate = new Date(booking.startDate);
      const diffTime = Math.abs(startDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      const reminders = booking.remindersSent || [];
      let reminderType = "";

      if (diffDays <= 7 && diffDays > 3 && !reminders.includes("7_days")) {
        reminderType = "7_days";
      } else if (diffDays <= 3 && diffDays > 1 && !reminders.includes("3_days")) {
        reminderType = "3_days";
      } else if (diffDays <= 1 && !reminders.includes("1_day")) {
        reminderType = "1_day";
      }

      if (reminderType) {
        const lead = booking.travellers?.[0];
        
        await notifyAdmins({
          recipients: adminEmails,
          subject: `Action Required: Booking Reminder (${diffDays} days left)`,
          html: `
            <h2>Booking Approval Reminder</h2>
            <p>The following booking is starting in <strong>${diffDays} days</strong> and is still <strong>PENDING</strong>.</p>
            <br/>
            <p><strong>Package:</strong> ${booking.packageTitle}</p>
            <p><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</p>
            <br/>
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${lead?.fullName || "N/A"}</p>
            <p><strong>Email:</strong> ${lead?.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${lead?.phone || "N/A"}</p>
            <br/>
            <p>Please login to the dashboard to approve or reject this booking immediately.</p>
          `,
        });

        // Update booking to avoid resending
        booking.remindersSent.push(reminderType);
        await booking.save();
        emailsSent++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: pendingBookings.length, 
      emailsSent 
    });

  } catch (error) {
    console.error("Reminder cron error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
