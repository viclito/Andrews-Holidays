import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { AgencyUser } from "@/models/AgencyUser";
import { Otp } from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });
    
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Check if user already exists (double check)
    const existingUser = await AgencyUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    await AgencyUser.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // Defaulting to admin as per request
    });

    // Delete OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration completion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
