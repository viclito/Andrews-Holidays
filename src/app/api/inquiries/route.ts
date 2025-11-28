import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";
import { sendInquiryNotification } from "@/lib/notifications";

const inquirySchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  packageId: z.string().optional(),
  packageTitle: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const json = await request.json();
    const data = inquirySchema.parse(json);

    await dbConnect();
    await Inquiry.create({
      ...data,
      userId: session?.user?.id,
    });
    
    await sendInquiryNotification({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message,
      packageTitle: data.packageTitle,
    });

    // Notify Admins
    const { getAdminEmails } = await import("@/lib/admin-utils");
    const { notifyAdmins } = await import("@/lib/notifications");
    const adminEmails = await getAdminEmails();
    
    await notifyAdmins({
      recipients: adminEmails,
      subject: `New Inquiry: ${data.fullName}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
        <p><strong>Package:</strong> ${data.packageTitle || "General"}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ message: "Inquiry received" }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unable to submit inquiry" },
      { status: 500 }
    );
  }
}

