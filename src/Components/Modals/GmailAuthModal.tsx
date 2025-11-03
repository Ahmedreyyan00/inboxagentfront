"use client";

import { FaLock, FaExclamationTriangle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaRegCircleQuestion, FaXmark } from "react-icons/fa6";
import React from "react";
import Api from "@/lib/Api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { GmailAuthModalTranslation } from "@/transalations/CommonTransaltion";

interface GoogleAccount {
  email: string;
  isActive: boolean;
  isReauthRequired?: boolean;
}

interface GmailAuthModalProps {
  onClose: () => void;
  isConnected: boolean;
  emails: string[];
  googleAccounts?: GoogleAccount[];
  mailBoxLimitReached: Boolean;
}

const GmailAuthModal: React.FC<GmailAuthModalProps> = ({
  onClose,
  isConnected,
  emails,
  googleAccounts,
  mailBoxLimitReached,
}) => {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = GmailAuthModalTranslation[currentLanguage];

  const handleGoogleAuth = async () => {
    try {
      const response = await Api.googleAuth();
      console.log(JSON.stringify(response.data));
      window.location.href = response.data.url;
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDisconnect = async (email: string) => {
    try {
      const response = await Api.disconnectGmail(email);
      console.log({ response });
      toast.success(`Gmail account ${email} disconnected successfully`);
      onClose();
    } catch (error) {
      console.log({ error });
      toast.error("Failed to disconnect Gmail account");
    }
  };

  return (
    <div
      id="gmail-auth-modal"
      className="fixed inset-0 bg-neutral-900/60 flex items-end sm:items-center justify-center z-50"
    >
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-2xl p-4 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-neutral-500 hover:text-neutral-800 transition"
          aria-label="Close modal"
        >
          <FaXmark className="text-xl sm:text-2xl" />
        </button>

        <div
          id="gmail-branding-block"
          className="flex flex-col items-center mb-8"
        >
          <div className="mb-4">
            <FcGoogle className="text-4xl sm:text-5xl" />
          </div>
          <h2 className="text-xl sm:text-2xl mb-2 text-center">
            {isConnected ? t.gmailConnectionStatus : t.securelyConnectYourGmail}
          </h2>
          <p className="text-neutral-600 text-center text-sm sm:text-base mb-2">
            {isConnected
              ? "Manage your connected Gmail accounts below."
              : "inbox agent uses Google's secure OAuth 2.0 system to access only invoice-related emails. Your personal messages remain private and untouched."}
          </p>
        </div>

        {/* Connected Emails List */}
        {isConnected && emails.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
              Connected Accounts ({emails.length})
            </h3>
            <div className="space-y-3">
              {emails.map((email, index) => {
                const accountInfo = googleAccounts?.find(
                  (acc) => acc.email === email
                );
                const needsReauth = accountInfo?.isReauthRequired;

                return (
                  <div key={index}>
                    <div
                      className={`flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between p-3 rounded-lg border ${
                        needsReauth
                          ? "bg-amber-50 border-amber-300"
                          : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FcGoogle className="text-neutral-500" />
                        <div className="flex flex-col">
                          <span className="text-neutral-800 font-medium">
                            {email}
                          </span>
                          {needsReauth && (
                            <div className="flex items-center gap-1 text-amber-700 text-xs mt-1">
                              <FaExclamationTriangle className="text-xs" />
                              <span>Connection expired - Please reconnect</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDisconnect(email)}
                        className="w-full sm:w-auto px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Connected Emails Message */}
        {isConnected && emails.length === 0 && (
          <div className="mb-6 text-center">
            <p className="text-neutral-600 mb-4">
              No Gmail accounts are currently connected.
            </p>
          </div>
        )}

        {/* Connect New Email Button */}
        {!mailBoxLimitReached && (
          <button
            className="w-full flex items-center justify-center gap-3 rounded-lg px-6 py-3 bg-neutral-800 shadow text-white text-sm sm:text-base transition hover:bg-neutral-900 mb-6"
            style={{ backgroundColor: "#1a1a1a" }}
            onClick={handleGoogleAuth}
          >
            <FcGoogle className="text-lg sm:text-xl" />
            <span>
              {isConnected
                ? "Connect New Gmail Account"
                : "Authorize with Google"}
            </span>
          </button>
        )}

        {/* Mailbox Limit Reached Message */}
        {mailBoxLimitReached && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <FaRegCircleQuestion className="text-white text-xs" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-800">
                  Mailbox Limit Reached
                </h4>
                <p className="text-sm text-orange-700 mt-1">
                  You have reached the maximum number of mailboxes allowed for
                  your current plan. Please upgrade your subscription to connect
                  more Gmail accounts.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 justify-center mb-3">
          <FaLock className="text-neutral-500" />
          <span className="text-neutral-600 text-sm">{t.oauthNote}</span>
        </div>

        <div className="text-center">
          <span className="text-sm underline text-neutral-500 hover:text-neutral-800 cursor-pointer">
            {t.learnMore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GmailAuthModal;
