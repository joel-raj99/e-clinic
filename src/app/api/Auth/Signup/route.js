import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ConnectDB from "@/utils/db";
import User from "@/Models/UserModel";

/**
 * Generate a unique sequential userId (e.g., USID001 → USID1000)
 */
const generateUserId = async (rolePrefix = "USID") => {
  try {
    const lastUser = await User.findOne({ role: "user" })
      .sort({ createdAt: -1 })
      .select("userId");

    let nextNumber = 1;

    if (lastUser?.userId) {
      const lastNumber = parseInt(lastUser.userId.replace(rolePrefix, ""), 10);
      nextNumber = lastNumber + 1;
    }

    return `${rolePrefix}${String(nextNumber).padStart(3, "0")}`;
  } catch (error) {
    console.error("Error generating User ID:", error);
    return `${rolePrefix}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
  }
};

export async function POST(req) {
  try {
    await ConnectDB();

    const { username, email, password, role } = await req.json();

    // ✅ Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields (username, email, password, role) are required." },
        { status: 400 }
      );
    }

    // ✅ Fetch Default Admin Credentials
    const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
    const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;

    // ✅ Check if admin exists
    const adminExists = await User.findOne({ role: "admin" });

    // ✅ Auto-create default admin account
    if (!adminExists && role === "admin" && email === DEFAULT_ADMIN_EMAIL) {
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

      const defaultAdmin = await User.create({
        username: username || "SuperAdmin",
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });

      const token = jwt.sign(
        { id: defaultAdmin._id, email: defaultAdmin.email, role: defaultAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const { password: _, ...userData } = defaultAdmin.toObject();

      return NextResponse.json(
        { message: "Default admin account created successfully.", user: userData, token },
        { status: 201 }
      );
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists. Try a different email." },
        { status: 400 }
      );
    }

    // ✅ Restrict multiple admins
    if (role === "admin" && adminExists) {
      return NextResponse.json(
        { message: "Only one Admin account is allowed." },
        { status: 403 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Auto-generate USID for user role
    let generatedUserId = null;
    if (role === "user") {
      generatedUserId = await generateUserId("USID");
    }

    // ✅ Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      userId: generatedUserId,
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = newUser.toObject();

    return NextResponse.json(
      { message: "Signup successful.", user: userData, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
