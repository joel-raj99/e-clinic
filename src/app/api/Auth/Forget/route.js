import { NextResponse } from "next/server";
import ConnectDB from "@/utils/db";
import User from "@/Models/UserModel";
import { sendEmail } from "@/utils/SendEmail";


export async function POST(req) {
  await ConnectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: "Email not registered" }, { status: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  await sendEmail(email, otp);
  return NextResponse.json({ message: "OTP sent to email" }, { status: 200 });
}
