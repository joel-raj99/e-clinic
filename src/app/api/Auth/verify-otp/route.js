import { NextResponse } from "next/server";
import ConnectDB from "@/utils/db";
import User from "@/Models/UserModel";

export async function POST(req) {
  await ConnectDB();
  const { email, otp } = await req.json();

  try {
    const user = await User.findOne({ email });
    console.log("Request OTP:", otp, "Stored OTP:", user?.otp, "Expiry:", user?.otpExpires);

    if (!user || String(user.otp) !== String(otp) || new Date() > new Date(user.otpExpires)) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return NextResponse.json({ message: "OTP verified successfully", user }, { status: 200 });

  } catch (error) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
