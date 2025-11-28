import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  console.log("Contact API hit");
  console.log("RESEND_API_KEY present:", !!process.env.RESEND_API_KEY);
  console.log("SUPPORT_EMAIL:", process.env.SUPPORT_EMAIL);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const json = await request.json();
    const { name, email, subject, message } = contactSchema.parse(json);

    const supportEmail = process.env.SUPPORT_EMAIL;

    if (!supportEmail) {
      return NextResponse.json(
        { error: "Support email not configured" },
        { status: 500 }
      );
    }

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Andrews Holiday Contact <onboarding@resend.dev>",
      to: supportEmail,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (resendError) {
      console.error("Resend API Error:", resendError);
      return NextResponse.json({ error: resendError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: resendData });
  } catch (error) {
    console.error("Contact form unexpected error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
