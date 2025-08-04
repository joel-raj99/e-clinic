"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

export default function Reset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ✅ Get email from localStorage on page load
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('/api/Auth/reset', {
        email,
        password: newPassword
      });

      if (response.status === 200) {
        toast.warning("Password reset successful!");
        setTimeout(() => {
          localStorage.removeItem("email");
          window.location.href = '/Auth/Login';
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again!"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="flex flex-col md:flex-row w-full h-full max-w-4xl bg-white rounded-sm shadow-lg overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

        {/* Left Column - Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/image/Hospital-visit.gif"
            alt="Reset Password"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Reset Your Password
          </h1>

          {/* Email (Auto-filled from localStorage) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FaEnvelope className="text-[#E01CC8]" /> Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2 border bg-gray-100 rounded-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* New Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FaLock className="text-[#E01CC8]" /> New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E01CC8] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <FaLock className="text-[#E01CC8]" /> Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E01CC8] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full bg-[#E01CC8] text-white py-2 rounded-sm font-semibold hover:bg-pink-500 transition"
          >
            Reset Password
          </button>

          <div className="text-center mt-4">
            <span>
              Remember your password?
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
