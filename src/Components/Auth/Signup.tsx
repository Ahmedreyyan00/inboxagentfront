"use client";

import { FaBolt, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SignUpTranslations } from "@/transalations/UnAuthPagesTransalation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { handleSignup } from "@/helpers/AuthHelper";
import { useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import LanguageSwitcher from "@/Components/Common/LanguageSwitcher";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import Api from "@/lib/Api";
import { SelectField, TextField } from "../Layout/Fields";
import { Button } from "../Layout/Button";
import { SlimLayout } from "../Layout/SlimLayout";

// Password strength calculation function
const calculatePasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "", color: "bg-neutral-200" };

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Determine strength level
  if (score <= 2) {
    return { score: score, label: "Weak", color: "bg-red-500" };
  } else if (score <= 4) {
    return { score: score, label: "Fair", color: "bg-yellow-500" };
  } else if (score <= 5) {
    return { score: score, label: "Good", color: "bg-blue-500" };
  } else {
    return { score: score, label: "Strong", color: "bg-green-500" };
  }
};

export default function Signup() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");

  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = SignUpTranslations[currentLanguage];

  // Calculate password strength
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailRegex.test(email.trim());
  }, [email]);

  const isFormValid =
    fullName.trim().length > 0 &&
    isEmailValid &&
    password.length >= 8 &&
    confirmPassword === password &&
    agreed;

  const processSignup = async () => {
    try {
      const successfullySignedUp = await handleSignup(
        {
          fullName,
          email,
          password,
        },
        confirmPassword,
        setLoading
      );
      if (successfullySignedUp) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
          redirectTo: "/dashboard",
        });

        if (planId) {
          const { data } = await Api.createSubscription(planId);
          window.location.href = data.url;
        } else {
          const { data } = await Api.createFreeSubscription();
          toast.success("Free subscription created");
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      toast.error("Signup failed");
      console.error("Signup error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error: any) {
      toast.error("Google login failed");
      console.error("Google login error:", error);
    }
  };

  return (
    <SlimLayout>
      <div className="flex justify-between items-center">
        <Link href="/" aria-label="Home">
          {/* <img src="/logo.svg" alt="Logo" width={100} height={100} /> */}
        </Link>
        <LanguageSwitcher className="ml-4" showLabel={false} />
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        {t.createSmartleAccount}
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        {t.alreadyAccount}{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          {t.logIn}
        </Link>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          processSignup();
        }}
        className="mt-10 grid grid-cols-1 gap-y-8"
      >
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            {t.fullName}
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder={t.fullName}
            required
            className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            {t.emailAddress}
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder={t.emailAddress}
            required
            className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            {t.password}
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-neutral-600">
                  Password strength:
                </span>
                <span
                  className={`text-xs font-medium ${passwordStrength.color.replace(
                    "bg-",
                    "text-"
                  )}`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            {t.confirmPassword}
          </label>
          <div className="relative">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              required
              className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            className="mt-1 mr-2"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm text-neutral-600">
            {t.iAgreeToThe}{" "}
            <span className="underline cursor-pointer">{t.termsOfService}</span>{" "}
            {t.and}{" "}
            <span className="underline cursor-pointer">{t.privacyPolicy}</span>
          </span>
        </div>

        <div>
          {loading ? (
            <Button
              type="button"
              variant="solid"
              color="blue"
              className="w-full"
              disabled
            >
              <ClipLoader color="#ffffff" size={18} />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="solid"
              color="blue"
              disabled={!isFormValid}
              className={`w-full ${!isFormValid ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : ''}`}
            >
              {t.createAccount}
            </Button>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500">
                {t.orSignUpWith}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-neutral-300 bg-white text-neutral-700 py-2 rounded-lg hover:bg-neutral-50 flex items-center justify-center gap-2"
          >
            <FcGoogle />
            {t.continueWithGoogle}
          </button>
        </div>
      </form>
    </SlimLayout>
  );
}
