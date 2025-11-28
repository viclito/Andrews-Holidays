import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { AgencyUser } from "@/models/AgencyUser";
import { Otp } from "@/models/Otp";
import { sendAdminOtp } from "@/lib/email-otp";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await AgencyUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP (upsert)
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send Email
    await sendAdminOtp(name, email, otp);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Registration initiation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
