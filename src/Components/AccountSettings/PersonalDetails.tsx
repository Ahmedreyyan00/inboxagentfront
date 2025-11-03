import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { PersonalInfo } from "./types";
import Api from "@/lib/Api";
import TwoFactorSetupModal from "../Modals/TwoFactorSetupModal";
import toast from "react-hot-toast";
import OtpVerificationModal from "../Modals/OtpVerificationModal";

interface PersonalDetailsProps {
  personalInfo: PersonalInfo;
  onPersonalInfoChange: (field: keyof PersonalInfo, value: string) => void;
  onUpdatePersonalInfo: () => void;
  showInfoConfirmation: boolean;
  isUpdating: boolean;
  t: any;
  fetchAccountSettings?: () => void;
}

export default function PersonalDetails({
  personalInfo,
  onPersonalInfoChange,
  onUpdatePersonalInfo,
  showInfoConfirmation,
  isUpdating,
  t,
  fetchAccountSettings
}: PersonalDetailsProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<"success" | "error" | null>(null);
  const [showModal, setShowModal] = useState(false);
  // Check URL parameters for email verification status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailVerified = urlParams.get('emailVerified');
    const error = urlParams.get('error');

    if (emailVerified === 'true') {
      setVerificationStatus("success");
      setVerificationMessage("Email verified successfully!");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Clear message after 5 seconds
      setTimeout(() => {
        setVerificationStatus(null);
        setVerificationMessage("");
      }, 5000);
    } else if (emailVerified === 'false') {
      setVerificationStatus("error");
      setVerificationMessage(error ? decodeURIComponent(error) : "Email verification failed");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Clear message after 5 seconds
      setTimeout(() => {
        setVerificationStatus(null);
        setVerificationMessage("");
      }, 5000);
    }
  }, []);

  const handleSendVerification = async () => {
    try {
      setIsVerifying(true);
      setVerificationMessage("");
      setVerificationStatus(null);

      // Send the email address in the request body
      const response = await Api.sendEmailVerification(personalInfo.email);

      if (response.data.success) {
        setVerificationStatus("success");
        setVerificationMessage("Verification email sent! Please check your inbox.");
        toast.success("Verification email sent! Please check your inbox.");
        setShowModal(true); // Show the modal for OTP verification
      } else {
        setVerificationStatus("error");
        setVerificationMessage(response.data.message || "Failed to send verification email");
      }
    } catch (error: any) {
      setVerificationStatus("error");
      setVerificationMessage(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setIsVerifying(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setVerificationStatus(null);
        setVerificationMessage("");
      }, 5000);
    }
  };

  const handleOtp = async (code: string) => {
    const resp = await Api.otpVerification(code)
    if (resp.data.success) {
      setVerificationStatus("success");
      setVerificationMessage("Email verified successfully!");
      toast.success("Email verified successfully!");
      setShowModal(false);
      await fetchAccountSettings?.()
    }
  };

  return (
    <section className="rounded-lg border-2 p-6 mb-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
      <h2 className="text-xl mb-4" style={{ color: 'var(--card-accent)' }}>{t.personalDetails}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm mb-1">{t.fullName}</label>
          <input
            type="text"
            className="w-full p-2 border-2 rounded-lg bg-neutral-50 cursor-not-allowed"
            style={{ borderColor: 'var(--card-border-light)' }}
            value={personalInfo.fullName}
            disabled
            title="Full name cannot be changed"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">{t.emailAddress}</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              className="min-w-0 flex-1 p-2 border-2 rounded-lg bg-neutral-50 cursor-not-allowed"
              style={{ borderColor: 'var(--card-border-light)' }}
              value={personalInfo.email}
              disabled
              title="Email address cannot be changed"
            />
            {personalInfo.isEmailVerified ? (
              <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                <FaCheckCircle className="mr-1" />
                Verified
              </div>
            ) : (
              <button
                className="w-full sm:w-auto px-3 py-1 text-xs border border-[var(--brand-color)] rounded-lg text-[var(--brand-color)] hover:bg-[var(--brand-color-light)] disabled:opacity-50 flex items-center justify-center transition-colors flex-shrink-0"
                onClick={handleSendVerification}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <FaSpinner className="animate-spin mr-1" />
                ) : null}
                {isVerifying ? "Sending..." : "Verify"}
              </button>
            )}
          </div>
          {verificationMessage && (
            <div className={`mt-2 text-xs ${verificationStatus === "success" ? "text-green-600" : "text-red-600"
              }`}>
              {verificationMessage}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">
            {t.phone} <span className="text-neutral-400">({t.optional})</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border-2 rounded-lg"
            style={{ borderColor: 'var(--card-border-light)' }}
            placeholder="+1 234 567 8901"
            value={personalInfo.phone}
            onChange={(e) => onPersonalInfoChange('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">
            {t.orgName}
            <span className="text-neutral-400">({t.optional})</span>
          </label>
          <input
            type="text"
            className="w-full p-2 border-2 rounded-lg"
            style={{ borderColor: 'var(--card-border-light)' }}
            placeholder="Acme Corp"
            value={personalInfo.organizationName}
            onChange={(e) => onPersonalInfoChange('organizationName', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:shadow-sm"
          onClick={onUpdatePersonalInfo}
          disabled={isUpdating}
          style={{ 
            backgroundColor: 'var(--card-accent)',
            borderColor: 'var(--card-accent)',
            color: 'white'
          }}
        >
          {isUpdating ? (
            <>
              <FaSpinner className="animate-spin" />
              Updating...
            </>
          ) : (
            t.UpdateInfo
          )}
        </button>
      </div>
      {showInfoConfirmation && (
        <div className="flex items-center mt-4 text-sm" style={{ color: 'var(--card-accent)' }}>
          <FaCheckCircle className="mr-2" style={{ color: 'var(--card-accent)' }} />
          Your details were updated successfully.
        </div>
      )}

      {showModal && (
        <OtpVerificationModal
          onClose={() => {
            setShowModal(false);

          }}
          type='emailVerify'
          onSuccess={(code: string) => handleOtp(code)}
        />
      )}
    </section>
  );
} 