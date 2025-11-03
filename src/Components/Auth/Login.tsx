"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBolt, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LoginTranslations } from "@/transalations/UnAuthPagesTransalation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ClipLoader } from "react-spinners";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { signIn, getSession, getProviders, useSession } from "next-auth/react";
import LanguageSwitcher from "@/Components/Common/LanguageSwitcher";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { useRouter, useSearchParams } from "next/navigation";
import Api from "@/lib/Api";
import { SlimLayout } from "../Layout/SlimLayout";
import { Button } from "../Layout/Button";

export default function Login() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { isLoading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string>("");
  const { data } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const planName = searchParams.get("planName");
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = LoginTranslations[currentLanguage as "en" | "fr" | "nl"];

  // Check for saved rate limit on component mount
  useEffect(() => {
    const savedRateLimit = localStorage.getItem("loginRateLimit");
    if (savedRateLimit) {
      try {
        const { email: limitedEmail, expiresAt, message } = JSON.parse(savedRateLimit);
        const now = Date.now();
        
        if (now < expiresAt) {
          const minutesLeft = Math.ceil((expiresAt - now) / (60 * 1000));
          setRateLimitMessage(
            message || `Too many login attempts for ${limitedEmail}. Try again in ${minutesLeft} minutes.`
          );
        } else {
          // Expired, clear it
          localStorage.removeItem("loginRateLimit");
        }
      } catch (e) {
        localStorage.removeItem("loginRateLimit");
      }
    }
  }, []);

  useEffect(() => {
    if (data?.accessToken) {
      try {
        // Check if the backend token has expired
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && now > payload.exp) {
          console.log("🕐 Login: Backend token expired, staying on login page");
          return; // Don't redirect, stay on login page
        }
        
        console.log(
          "✅ Login: User already authenticated, redirecting to dashboard"
        );
        router.push("/dashboard");
      } catch (error) {
        console.log("⚠️ Login: Error checking token expiry:", error);
        // If we can't decode the token, assume it's invalid and stay on login
      }
    }
  }, [data, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if user is currently rate limited
    if (rateLimitMessage) {
      toast.error("You are currently rate limited. Please wait before trying again.", {
        icon: "⏱️",
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        redirectTo: "/",
      });
      console.log(JSON.stringify(res, null, 2));
      
      // Check for ANY error first (NextAuth can return ok:true with errors)
      if (res?.error) {
        // Check for rate limit error
        if (res.error.startsWith("RATE_LIMIT:")) {
          const message = res.error.replace("RATE_LIMIT: ", "");
          console.error("Login failed - rate limited");
          
          // Save rate limit to localStorage (expires in 15 minutes)
          const rateLimitData = {
            email: email.toLowerCase(),
            expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
            message: message,
          };
          localStorage.setItem("loginRateLimit", JSON.stringify(rateLimitData));
          setRateLimitMessage(message);
          
          toast.error(message, {
            duration: 6000,
            icon: "⏱️",
          });
          return;
        }
        
        // Check for CredentialsSignin error
        if (res.error === "CredentialsSignin") {
          console.error("Login failed - invalid credentials");
          toast.error("Email or password is incorrect. Please try again.");
          return;
        }
        
        // Handle Configuration error (often means backend issue or rate limit)
        if (res.error === "Configuration") {
          console.error("Login configuration error - checking for rate limit");
          // This might be a rate limit that didn't get the proper error format
          const message = "Too many login attempts. Please wait 15 minutes before trying again.";
          const rateLimitData = {
            email: email.toLowerCase(),
            expiresAt: Date.now() + (15 * 60 * 1000),
            message: message,
          };
          localStorage.setItem("loginRateLimit", JSON.stringify(rateLimitData));
          setRateLimitMessage(message);
          
          toast.error(message, {
            duration: 6000,
            icon: "⏱️",
          });
          return;
        }
        
        // Handle other errors with user-friendly messages
        console.error("Login failed", res.error);
        
        const friendlyMessage = res.error === "AccessDenied" 
          ? "Access denied. Please check your credentials and try again."
          : res.error === "Verification"
          ? "Email verification required. Please check your email."
          : "Login failed. Please try again or contact support if the issue persists.";
        
        toast.error(friendlyMessage);
        return;
      }

      if (res?.ok) {
        const session = await getSession();
        console.log("session", JSON.stringify(session, null, 2));
        if (session?.user?.twoFactorEnabled) {
          console.log("🔄 Login: 2FA required, redirecting to 2FA page");
          return (window.location.href = "/2fa");
        } else {
          console.log("✅ Login: Successful");
          
          // Clear rate limit on successful login
          localStorage.removeItem("loginRateLimit");
          setRateLimitMessage("");
          
          toast.success("Login successful!");

          // Check if user came from pricing page with a selected plan
          const selectedPlanId =
            planId || localStorage.getItem("selectedPlanId");
          const selectedPlanName =
            planName || localStorage.getItem("selectedPlanName");

          if (selectedPlanId) {
            try {
              // Create Stripe checkout session for the selected plan
              const response = await Api.createSubscription(selectedPlanId);
              if (response.data.url) {
                // Clear stored plan data
                localStorage.removeItem("selectedPlanId");
                localStorage.removeItem("selectedPlanName");

                toast.success(
                  `Redirecting to checkout for ${
                    selectedPlanName || "selected plan"
                  }...`
                );
                window.location.href = response.data.url;
                return;
              }
            } catch (error) {
              console.error("Failed to create checkout session:", error);
              toast.error(
                "Failed to start checkout process. Redirecting to dashboard."
              );
            }
          }

          // Default redirect to dashboard
          router.push("/dashboard");
          return;
        }
      }
      
      // If we reach here without ok and without error, something unexpected happened
      console.error("Unexpected login response:", res);
      toast.error("Login failed. Please try again.");
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle network errors that might occur before NextAuth processing
      // These are typically connection issues, not authentication errors
      toast.error("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      console.log("Starting Google sign-in...");

      // Check if Google provider is available
      const providers = await getProviders();
      console.log("Available providers:", providers);

      if (!providers?.google) {
        toast.error(
          "Google authentication is not configured. Please contact support."
        );
        console.error("Google provider not found in available providers");
        return;
      }

      // Include plan info in callback URL if available
      const callbackUrl =
        planId && planName
          ? `/dashboard?plan=${planId}&planName=${encodeURIComponent(planName)}`
          : "/dashboard";

      const result = await signIn("google", {
        callbackUrl,
        redirect: false, // Don't redirect automatically to see what happens
      });

      console.log("Google sign-in result:", result);

      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        
        // Check for rate limit error
        if (result.error.startsWith("RATE_LIMIT:")) {
          const message = result.error.replace("RATE_LIMIT: ", "");
          
          // Save rate limit to localStorage
          const rateLimitData = {
            email: "google-login",
            expiresAt: Date.now() + (15 * 60 * 1000),
            message: message,
          };
          localStorage.setItem("loginRateLimit", JSON.stringify(rateLimitData));
          setRateLimitMessage(message);
          
          toast.error(message, {
            duration: 6000,
            icon: "⏱️",
          });
        } else {
          toast.error(`Google authentication failed: ${result.error}`);
        }
      } else if (result?.url) {
        // Successful authentication, redirect manually
        window.location.href = result.url;
      } else {
        console.log("Google sign-in completed, checking for success...");
        // If no error and no URL, the sign-in might have succeeded
        // Let NextAuth handle the redirect
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(
        `Google authentication failed: ${error.message || "Unknown error"}`
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-full text-base-content">
      {/* Navbar */}
      <SlimLayout>
        <div className="flex justify-between items-center">
          <Link href="/" aria-label="Home">
            {/* <img src="/logo.svg" alt="Logo" width={200} height={200} /> */}
          </Link>
          <LanguageSwitcher className="ml-4" showLabel={false} />
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900">{t.signIn}</h2>
        <p className="mt-2 text-sm text-gray-700">
          {t.noAccount}{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">
            {t.signUp}
          </Link>
        </p>
        
        {/* Rate Limit Warning */}
        {rateLimitMessage && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
            <div className="flex items-start">
              <span className="text-3xl mr-3">🚫</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-800 mb-2">
                  Account Temporarily Locked
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  {rateLimitMessage}
                </p>
                <div className="mt-3 p-3 bg-red-100 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>What this means:</strong><br/>
                    • Too many failed login attempts detected<br/>
                    • Your account is protected from unauthorized access<br/>
                    • Wait 15 minutes before trying again<br/>
                    • Or use "Forgot Password" to reset your password
                  </p>
                </div>
                <div className="mt-3 flex gap-3">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-red-700 font-medium underline hover:text-red-900"
                  >
                    Reset Password Instead
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("loginRateLimit");
                      setRateLimitMessage("");
                    }}
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    Dismiss This Warning
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="mt-10 grid grid-cols-1 gap-y-8"
        >
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              {t.email}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              <span className="ml-2 text-sm text-gray-600">{t.remember}</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
              {t.forgot}
            </Link>
          </div>

          <div>
            {loading || isLoading ? (
              <Button type="button" variant="solid" color="blue" className="w-full" disabled>
                <ClipLoader color="#ffffff" size={18} />
              </Button>
            ) : rateLimitMessage ? (
              <Button type="button" variant="solid" color="blue" className="w-full opacity-50 cursor-not-allowed" disabled>
                ⏱️ Rate Limited - Wait to Try Again
              </Button>
            ) : (
              <Button type="submit" variant="solid" color="blue" className="w-full">
                {t.signIn}
              </Button>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-neutral-500">{t.or}</span>
              </div>
            </div>

            {googleLoading ? (
              <button
                disabled
                className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white py-2 opacity-50"
              >
                <ClipLoader color="#374151" size={16} />
                Signing in with Google...
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white py-2 hover:bg-neutral-50"
              >
                <FcGoogle />
                <span>{t.google}</span>
              </button>
            )}
          </div>
        </form>
      </SlimLayout>
    </div>
  );
}
