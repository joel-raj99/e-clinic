"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const response = await axios.post("/api/Auth/Login", { email, password });

      if (response.status === 200) {
        const { token, role, message } = response.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("email", email);

        toast.warning(message || "OTP sent to your email!");

        setTimeout(() => {
          window.location.href = "/Auth/otp";
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <ToastContainer />
      <div className="flex flex-col md:flex-row w-full h-full max-w-4xl bg-white rounded-sm shadow-lg overflow-hidden">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/image/Doctors.gif"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-sm font-bold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h1>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FaEnvelope className="text-[#E01CC8]" /> Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
 className="w-full text-black px-4 py-2 border-b border-gray-400 focus:outline-none focus:border-[#E01CC8] transition"            />
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FaLock className="text-[#E01CC8]" /> Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
 className="w-full text-black px-4 py-2 border-b border-gray-400 focus:outline-none focus:border-[#E01CC8] transition"            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-10 text-lg text-[#E01CC8]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-[#E01CC8] text-white py-2 rounded-sm font-semibold hover:bg-[#e17ed5d7] transition"
          >
            Login
          </button>

          {/* Forget Password */}
          <div className="text-center mt-4">
            <span className="text-gray-600">
              Forget your Password?
              <Link href="../Forget" className="text-[#E01CC8] ml-2">
                Forget Password
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
