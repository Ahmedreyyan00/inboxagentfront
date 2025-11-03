"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaXmark,
  FaShieldHalved,
  FaQrcode,
  FaCircleXmark,
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModalTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

interface TwoFactorSetupModalProps {
  onClose: () => void;
  onSuccess: any;
  type?: string;
}

const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  onClose,
  onSuccess,
  type
}) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = ModalTranslations[currentLanguage];

  useEffect(() => {
    generateQrCode();
  }, []);

  const generateQrCode = async () => {
    setLoading(true);
    try {
      const { data } = await Api.generateQr();
      setQrCode(data.qrCode);
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      toast.error(error.response?.data?.message || "Failed to generate QR code");
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
      const response = await Api.verify2FASetup(fullCode);
      if (response.data.success) {
        setSuccess(true);
        toast.success(t.setupCompleted);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
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
            <FaShieldHalved className="text-3xl text-neutral-800" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-2">
            {t.setupTwoFactorAuth}
          </h2>
          <p className="text-neutral-600 text-center text-base">
            {t.scanQrCodeDescription}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <FaQrcode className="text-neutral-400 mr-2" />
            <span className="text-sm text-neutral-600">{t.scanQrCode}</span>
          </div>
          <div className="flex justify-center">
            {loading ? (
              <div className="w-48 h-48 bg-neutral-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
              </div>
            ) : qrCode ? (
              <div className="w-48 h-48 bg-white border border-neutral-200 rounded-lg flex items-center justify-center p-4">
                <img src={qrCode} alt="QR Code" className="w-full h-full" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="text-neutral-500">{t.failedToLoadQrCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Verification Code Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            {t.enterVerificationCode}
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
                disabled={verifying || success}
              />
            ))}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
            <FaCircleXmark />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
            <FaCheckCircle />
            {t.setupCompleted}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={verifying || success}
            className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.cancel}
          </button>
          <button
            onClick={()=>{
              if (type === 'emailVerify') {
                onSuccess(code.join(""));
              }
              else {
                handleVerify();
              }
            }}
            disabled={code.join("").length !== 6 || verifying || success}
            className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {verifying ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              t.verifyAndEnable
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="text-sm font-medium text-neutral-800 mb-2">{t.instructions}</h4>
          <ol className="text-sm text-neutral-600 space-y-1">
            <li>{t.instruction1}</li>
            <li>{t.instruction2}</li>
            <li>{t.instruction3}</li>
            <li>{t.instruction4}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetupModal; 