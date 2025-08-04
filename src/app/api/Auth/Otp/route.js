import { NextResponse } from "next/server";
import ConnectDB from "@/utils/db";
import User from "@/Models/UserModel";

export async function POST(req) {
  await ConnectDB();
  const { email, otp } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (!user.otpExpires || new Date() > user.otpExpires) {
      return NextResponse.json({ message: "Expired OTP" }, { status: 400 });
    }

    // ✅ Clear OTP after verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
