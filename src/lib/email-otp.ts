import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendAdminOtp(registrantName: string, registrantEmail: string, otp: string) {
  console.log("Attempting to send OTP email...");
  if (!resend) {
    console.error("Resend API key missing, skipping OTP email.");
    throw new Error("Resend API key is missing");
  }

  // Hardcoded recipient as per requirement
  const adminEmail = "berglin1998@gmail.com";
  console.log(`Sending OTP to ${adminEmail} for registrant ${registrantEmail}`);

  try {
    const data = await resend.emails.send({
      from: `Andrews Holiday <onboarding@resend.dev>`,
      to: [adminEmail],
      subject: `Admin Registration OTP for ${registrantName}`,
      text: `
A new admin registration has been initiated.

Registrant Name: ${registrantName}
Registrant Email: ${registrantEmail}

OTP: ${otp}

This OTP expires in 10 minutes.
      `.trim(),
    });
    console.log("OTP email sent successfully:", data);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error; // Re-throw to be caught by the route handler
  }
}
