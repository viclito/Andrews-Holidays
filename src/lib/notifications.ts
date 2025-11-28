import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

type InquiryEmailPayload = {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  packageTitle?: string;
};

export async function sendInquiryNotification(payload: InquiryEmailPayload) {
  if (!resend) {
    console.warn("Resend API key missing, skipping inquiry email.");
    return;
  }

  await resend.emails.send({
    from: `Andrews Holiday <notifications@southerntrails.travel>`,
    to: [siteConfig.contactEmail],
    subject: `New Inquiry${payload.packageTitle ? ` · ${payload.packageTitle}` : ""}`,
    text: `
Name: ${payload.fullName}
Email: ${payload.email}
Phone: ${payload.phone ?? "N/A"}

Message:
${payload.message}
    `.trim(),
  });
}


type AdminNotificationPayload = {
  subject: string;
  html: string;
  recipients: string[];
};

export async function notifyAdmins(payload: AdminNotificationPayload) {
  if (!resend) {
    console.warn("Resend API key missing, skipping admin notification.");
    return;
  }

  if (payload.recipients.length === 0) {
    console.warn("No admin recipients found.");
    return;
  }

  // Send individually or as bcc? Resend supports multiple 'to'.
  // However, to avoid exposing admin emails to each other if that's a concern (usually not for internal),
  // we can just send to all.
  
  try {
    await resend.emails.send({
      from: `Andrews Holiday System <system@southerntrails.travel>`,
      to: payload.recipients,
      subject: payload.subject,
      html: payload.html,
    });
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}
