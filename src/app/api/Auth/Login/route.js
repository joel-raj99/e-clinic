import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import ConnectDB from "@/utils/db";
import User from "@/Models/UserModel";
import { sendEmail } from "@/utils/SendEmail1.js";

export async function POST(req) {
  try {
    await ConnectDB();

    const { identifier, password } = await req.json(); // ✅ Can be email or userId

    // ✅ Validate input
    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email/UserID and password are required." },
        { status: 400 }
      );
    }

    // ✅ Find user by email OR userId
    const user = await User.findOne({
      $or: [{ email: identifier }, { userId: identifier }]
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // ✅ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 400 }
      );
    }

    // ✅ Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Store OTP with expiry
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    // ✅ Send OTP email
    try {
      await sendEmail(
        user.email,
        "Your Login OTP",
        `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        { message: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent successfully to your registered email.", role: user.role },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login OTP Error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
