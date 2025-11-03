"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import axiosInstance from "@/api/axiosInstance";
import OtpVerificationModal from "@/Components/Modals/OtpVerificationModal";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(initialEmail)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!initialEmail) {
      toast.error("Please go back to the forgot password page and enter your email.")
      router.push("/forgot-password")
    } else {
      // Show the modal automatically when email is available
      setShowModal(true)
    }
  }, [initialEmail, router])

  const handleResendOtp = async () => {
    try {
      await axiosInstance.post("/api/auth/forgot-password", { email });
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  const handleOtpSuccess = async (otp: string) => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.post("/api/auth/verify-otp", { email, otp });
      
      const encodedEmail = btoa(email);
      const encodedOtp = btoa(otp);

      router.push(`/reset-password?email=${encodeURIComponent(encodedEmail)}&otp=${encodeURIComponent(encodedOtp)}`);
      toast.success("OTP verified successfully. You can now reset your password.")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false)
    }
  };

  const handleCloseModal = () => {
    setShowModal(false)
    router.push("/forgot-password")
  };

  if (!initialEmail) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-8 shadow-md text-center">
          <p className="text-gray-500">Redirecting to forgot password...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-8 shadow-md text-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Password Reset</h1>
            <p className="text-gray-500">
              We've sent a verification code to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-400">
              Please check your email and enter the 6-digit code to continue.
            </p>
            {loading && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Verifying...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <OtpVerificationModal
          onClose={handleCloseModal}
          onSuccess={handleOtpSuccess}
          type="emailVerify"
          email={email}
          title="Verify Your Email"
          description={`We've sent a 6-digit verification code to ${email}. Please enter it below to reset your password.`}
          resendFunction={handleResendOtp}
          resendCooldown={60}
        />
      )}
    </>
  )
}
