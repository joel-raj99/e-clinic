"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // ✅ Retrieve data from sessionStorage
  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("email") : "";
  const role =
    typeof window !== "undefined" ? sessionStorage.getItem("role") : "";
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : "";

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (!email) {
      toast.error("Email not found. Please login again.");
      return;
    }
    if (otpCode.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      const response = await axios.post("/api/Auth/verify-otp", {
        email,
        otp: otpCode,
      });

      if (response.status === 200) {
        toast.warning("OTP verified successfully!");

        // ✅ Keep token in sessionStorage
        if (token) {
          sessionStorage.setItem("token", token);
        }

        // ✅ Redirect based on role
        setTimeout(() => {
          if (role === "admin") {
            window.location.href = "/admindashboard";
          } else {
            window.location.href = "/userdashboard";
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <ToastContainer />
      <div className="flex flex-col md:flex-row w-full h-full max-w-4xl bg-white rounded-sm shadow-lg overflow-hidden">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src="/image/Doctor.gif"
            alt="OTP Verification"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right OTP Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-sm font-bold text-gray-800 mb-6 text-center">
            Enter OTP
          </h1>
          <p className="text-gray-600 text-center mb-4">
            Please enter the 6-digit OTP sent to your email.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-xl border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#E01CC8]"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full bg-[#E01CC8] text-black py-2 rounded-sm font-semibold hover:bg-[#f389e7] transition"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}
