"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Forget() {
  const [email, setEmail] = useState("");

  const handleForgetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await axios.post("/api/Auth/Forget", { email });

      if (response.status === 200) {
        // ✅ Store email for OTP verification page
        localStorage.setItem("email", email);

        toast.warning("OTP sent to your email!");

        // ✅ Redirect to OTP page
        setTimeout(() => {
          window.location.href = "/Auth/otp";
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="flex flex-col md:flex-row w-full h-full max-w-4xl bg-white rounded-sm shadow-lg overflow-hidden">
        
        {/* Left Column - Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/image/Cardiologist.gif"
            alt="Forget Password"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-sm font-bold text-gray-800 mb-6 text-center">
            Forget Your Password
          </h1>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E01CC8]"
            />
          </div>

          <button
            type="button"
            onClick={handleForgetPassword}
            className="w-full bg-[#E01CC8] text-white py-2 rounded-sm font-semibold hover:bg-pink-800 transition"
          >
            Send OTP
          </button>

          <div className="text-center mt-4">
            <span>
              Remember your password?{" "}
              <Link href="/Login" className="text-[#E01CC8] ml-2">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
