"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBolt, FaArrowLeft } from "react-icons/fa";
import { TwoFactorAuthTranslations } from "@/transalations/UnAuthPagesTransalation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import LanguageSwitcher from "@/Components/Common/LanguageSwitcher";
import { isValidLanguageCode } from "@/Utils/languageUtils";

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>;
  onResendCode?: () => Promise<void>;
  email?: string;
  onBack?: () => void;
}

export default function TwoFactorAuth({
  onVerify,
  onResendCode,
  email,
  onBack,
}: TwoFactorAuthProps) {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = TwoFactorAuthTranslations[currentLanguage];

  // Handle resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle code input changes
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify();
    }
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newCode = pastedData.split("").slice(0, 6);
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error(t.invalidCode);
      return;
    }

    setLoading(true);
    try {
      const success = await onVerify(fullCode);
      if (success) {
        toast.success("Verification successful!");
        // Note: Redirect is handled by the parent component (2fa page)
        // No need to redirect here since the page will handle it
      } else {
        toast.error(t.invalidCode);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || !onResendCode) return;

    setResendLoading(true);
    try {
      await onResendCode();
      toast.success(t.codeSent);
      setResendTimer(30); // 30 seconds cooldown
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error(error.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="h-full text-base-content">
      <main className="flex min-h-[800px] w-full items-center justify-center bg-neutral-50 p-4">
        <div
          className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
          id="2fa-card"
        >
          <div id="logo">
            <div className="mb-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-neutral-800 flex items-center justify-center">
                <FaBolt className="text-3xl text-white" />
              </div>
              <h1 className="mt-4 text-2xl text-neutral-900">{t.title}</h1>
              <p className="mt-2 text-sm text-neutral-600">{t.description}</p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="mb-6 flex justify-end">
            <LanguageSwitcher />
          </div>

          <div className="space-y-6">
            {/* Email display */}
            {email && (
              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  Code sent to <span className="font-medium">{email}</span>
                </p>
              </div>
            )}

            {/* Code input */}
            <div>
              <label className="block text-sm text-neutral-700 mb-3">
                {t.codeLabel}
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border border-neutral-300 rounded-md focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Verify button */}
            {loading ? (
              <button className="cursor-pointer w-full rounded-md bg-neutral-900 py-2 text-white hover:bg-neutral-800">
                <ClipLoader color="white" size={20} />
              </button>
            ) : (
              <button
                onClick={handleVerify}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerify();
                  }
                }}
                disabled={code.join("").length !== 6}
                className="w-full rounded-md bg-neutral-900 py-2 text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {t.verify}
              </button>
            )}

            {/* Resend code */}
            {onResendCode && (
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-neutral-500">
                    {t.resendIn} {resendTimer} {t.seconds}
                  </p>
                ) : (
                  <button
                    onClick={handleResendCode}
                    disabled={resendLoading}
                    className="text-sm text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed"
                  >
                    {resendLoading ? (
                      <ClipLoader color="#6b7280" size={14} />
                    ) : (
                      t.resend
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Back to login */}
            <div className="text-center">
              {onBack ? (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
                >
                  <FaArrowLeft className="text-xs" />
                  {t.backToLogin}
                </button>
              ) : (
                <Link href="/login">
                  <span className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 cursor-pointer">
                    <FaArrowLeft className="text-xs" />
                    {t.backToLogin}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 