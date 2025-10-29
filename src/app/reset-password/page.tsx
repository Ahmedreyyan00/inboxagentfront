"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import axiosInstance from "@/api/axiosInstance";
import { FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

async function resetPasswordAction(formData: FormData, push: (url: string) => void) {
  const email = formData.get("email");
  const otp = formData.get("otp");
  const newPassword = formData.get("newPassword");

  if (!email || !otp || !newPassword) {
    return { error: "Email, OTP, and new password are required." };
  }

  try {
    const { data } = await axiosInstance.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });

    push("/login");
    return data;
  } catch (error: any) {
    return { error: error.response?.data?.message || "Failed to reset password." };
  }
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialEmail = atob(searchParams.get("email") || "")
  const initialOtp = atob(searchParams.get("otp") || "")

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState(initialOtp)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  useEffect(() => {
    if (!initialEmail || !initialOtp) {
      toast.error("Please go through the forgot password and OTP verification steps first.")
      router.push("/forgot-password")
    }
  }, [initialEmail, initialOtp, router])

  const validatePassword = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    validatePassword(password)
  }

  const isPasswordValid = Object.values(passwordStrength).every(Boolean)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    formData.append("email", email)
    formData.append("otp", otp)

    const result = await resetPasswordAction(formData, router.push)
    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
    } else {
      toast.success("Your password has been reset successfully. You can now log in.")
    }
    setLoading(false)
  }

  if (!initialEmail || !initialOtp) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-8 shadow-md text-center">
          <p className="text-gray-500">Redirecting to forgot password...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-1 text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaShieldAlt className="text-3xl text-neutral-800" />
          </div>
          <h1 className="text-2xl font-bold">Create New Password</h1>
          <p className="text-gray-500">Enter a strong password for your account.</p>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <FaCheckCircle className="text-green-600" />
            <span className="text-sm font-medium">Email verified successfully!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Your email <strong>{email}</strong> has been verified. You can now set a new password.
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                required
                onChange={handlePasswordChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
            <div className="space-y-1 text-sm">
              <div className={`flex items-center gap-2 ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordStrength.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordStrength.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordStrength.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>One lowercase letter</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordStrength.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>One number</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${passwordStrength.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>One special character</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-neutral-800 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading || !isPasswordValid}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Resetting password...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-600">
            <strong>Security Tip:</strong> Choose a strong password that you haven't used on other websites. 
            Consider using a password manager to generate and store secure passwords.
          </p>
        </div>
      </div>
    </div>
  )
}
