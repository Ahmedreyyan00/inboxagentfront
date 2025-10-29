"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaXmark,
  FaShieldHalved,
  FaQrcode,
  FaCircleXmark,
  FaEnvelope,
  FaMobile,
  FaClock,
} from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModalTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

interface OtpVerificationModalProps {
  onClose: () => void;
  onSuccess: any;
  type?: string;
  email?: string;
  phone?: string;
  title?: string;
  description?: string;
  resendFunction?: () => void;
  resendCooldown?: number;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  onClose,
  onSuccess,
  type = "2fa",
  email,
  phone,
  title,
  description,
  resendFunction,
  resendCooldown = 60
}) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = ModalTranslations[currentLanguage];

  useEffect(() => {
    if (type === "2fa") {
      generateQrCode();
    }
  }, [type]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const generateQrCode = async () => {
    setLoading(true);
    try {
      const { data } = await Api.generateQr();
      setQrCode(data.qrCode);
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      toast.error(error.response?.data?.message || t.failedToGenerateQrCode);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

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
      setError(t.pleaseEnter6DigitCode);
      return;
    }

    setVerifying(true);
    setError("");
    
    try {
      if (type === "2fa") {
        const response = await Api.verify2FASetup(fullCode);
        if (response.data.success) {
          setSuccess(true);
          toast.success(t.setupCompleted);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1500);
        }
      } else {
        // For email verification or other OTP types
        onSuccess(fullCode);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.response?.data?.message || t.invalidVerificationCode);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !resendFunction) return;
    
    try {
      await resendFunction();
      setCanResend(false);
      setResendTimer(resendCooldown);
      toast.success(t.otpResentSuccessfully);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t.failedToResendOtp);
    }
  };

  const getModalTitle = () => {
    if (title) return title;
    return type === "2fa" ? t.setupTwoFactorAuth : t.verifyYourAccount;
  };

  const getModalDescription = () => {
    if (description) return description;
    
    if (type === "2fa") {
      return t.scanQrCodeDescription;
    } else if (email) {
      return t.emailOtpDescription.replace("{email}", email);
    } else if (phone) {
      return t.phoneOtpDescription.replace("{phone}", phone);
    }
    return t.generalOtpDescription;
  };

  const getIcon = () => {
    if (type === "2fa") return <FaShieldHalved className="text-3xl text-neutral-800" />;
    if (email) return <FaEnvelope className="text-3xl text-neutral-800" />;
    if (phone) return <FaMobile className="text-3xl text-neutral-800" />;
    return <FaShieldHalved className="text-3xl text-neutral-800" />;
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-neutral-500 hover:text-neutral-800 transition"
          aria-label={t.close}
        >
          <FaXmark className="text-2xl" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full">
            {getIcon()}
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-2">
            {getModalTitle()}
          </h2>
          <p className="text-neutral-600 text-center text-base leading-relaxed">
            {getModalDescription()}
          </p>
        </div>

        {/* QR Code Section (only for 2FA) */}
        {type === "2fa" && (
          <div className="mb-6">
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                <FaQrcode className="text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">{t.scanQrCode}</span>
              </div>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600"></div>
                </div>
              ) : qrCode ? (
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-neutral-500">
                  {t.failedToLoadQrCode}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions for 2FA */}
        {type === "2fa" && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-2 mb-3">
              <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">{t.instructions}</span>
            </div>
            <div className="space-y-2 text-sm text-blue-700">
              <p>{t.instruction1}</p>
              <p>{t.instruction2}</p>
              <p>{t.instruction3}</p>
              <p>{t.instruction4}</p>
            </div>
          </div>
        )}

        {/* Verification Code Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            {type === "2fa" ? t.enterVerificationCode : t.enterOtpCode}
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
                className="w-12 h-12 text-center text-lg font-semibold border border-neutral-300 rounded-md focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-colors"
                placeholder="0"
                disabled={verifying || success}
              />
            ))}
          </div>
          <p className="text-xs text-neutral-500 text-center mt-2">
            {t.otpInputHint}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <FaCircleXmark className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <FaCheckCircle className="flex-shrink-0" />
            <span>{t.setupCompleted}</span>
          </div>
        )}

        {/* Resend OTP Section */}
        {type !== "2fa" && resendFunction && (
          <div className="mb-6 text-center">
            <p className="text-sm text-neutral-600 mb-2">{t.didntReceiveCode}</p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="text-sm text-neutral-800 hover:text-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed font-medium"
            >
              {canResend ? (
                t.resendCode
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <FaClock className="text-xs" />
                  {t.resendIn.replace("{seconds}", resendTimer.toString())}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={verifying || success}
            className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleVerify}
            disabled={code.join("").length !== 6 || verifying || success}
            className="flex-1 px-4 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {verifying ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              type === "2fa" ? t.verifyAndEnable : t.verifyCode
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal; 