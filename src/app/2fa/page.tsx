"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import TwoFactorAuth from "@/Components/Auth/TwoFactorAuth";
import { use2FA } from "@/hooks/use2FA";

export default function TwoFactorAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  
  console.log({ session });
  
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      // No session, redirect to login
      router.push("/login");
      return;
    }

    if (!session.user?.twoFactorEnabled) {
      // User doesn't have 2FA enabled, redirect to dashboard
      router.push("/");
      return;
    }

    if (session.user?.is2FAVerified) {
      // User has already completed 2FA verification, redirect to dashboard
      router.push("/");
      return;
    }

    // Set email from session for users who need to verify 2FA
    setEmail(session.user.email || "");
  }, [session, status, router]);

  const { verifyCode, resendCode } = use2FA(email);

  const handleVerification = async (code: string): Promise<boolean> => {
    const success = await verifyCode(code);
    if (success) {
      // Redirect to dashboard after successful verification
      router.push("/");
    }
    return success;
  };

  const handleBack = () => {
    // Sign out and redirect to login
    signOut({ callbackUrl: "/login" });
  };

  // Show loading while checking session
  if (status === "loading" || !email) {
    return (
      <div className="h-full text-base-content">
        <main className="flex min-h-[800px] w-full items-center justify-center bg-neutral-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <TwoFactorAuth
      onVerify={handleVerification}
      onResendCode={resendCode}
      email={email}
      onBack={handleBack}
    />
  );
}
