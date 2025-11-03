"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axiosInstance from "@/api/axiosInstance";
import { FaEnvelope, FaShieldAlt, FaClock } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    
    const emailValue = formData.get("email") as string
    setEmail(emailValue)

    if (!emailValue) {
      setError("Email is required.")
      setLoading(false)
      return
    }

    try {
      await axiosInstance.post("/api/auth/forgot-password", { email: emailValue });
      toast.success("Password reset OTP sent successfully!")
      router.push(`/verify-otp?email=${encodeURIComponent(emailValue)}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send password reset email."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-1 text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaShieldAlt className="text-3xl text-neutral-800" />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-gray-500">Enter your email to receive a password reset verification code.</p>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <FaEnvelope className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1 text-blue-700">
                <li>• We'll send a 6-digit verification code to your email</li>
                <li>• Enter the code to verify your identity</li>
              </ul>
            </div>
          </div>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-neutral-800 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending verification code...</span>
              </div>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-start gap-2">
            <FaClock className="text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-neutral-600">
              <p className="font-medium mb-1">Security Note</p>
              <p>The verification code will expire in 10 minutes for security reasons. If you don't receive it, check your spam folder or request a new code.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
