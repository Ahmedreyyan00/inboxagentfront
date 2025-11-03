"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModalTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

interface AccountantEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentEmail?: string | null;
}

export default function AccountantEmailModal({
  isOpen,
  onClose,
  onSuccess,
  currentEmail,
}: AccountantEmailModalProps) {
  const [email, setEmail] = useState(currentEmail || "");
  const [loading, setLoading] = useState(false);
  const [originalEmail, setOriginalEmail] = useState(currentEmail || "");

  // Update email state when currentEmail prop changes
  useEffect(() => {
    setEmail(currentEmail || "");
    setOriginalEmail(currentEmail || "");
  }, [currentEmail]);

  // Check if email has been modified
  const hasChanges = email.trim() !== originalEmail.trim();
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = ModalTranslations[currentLanguage];

  const handleClose = () => {
    if (hasChanges && email.trim()) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?"
      );
      if (!confirmed) return;
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      
      // Use the existing automation settings API to update the accountant email
      const payload = {
        invoiceForwarding: {
          enableAutomaticForwarding: true,
          recipientEmail: email.trim(),
          forwardingMethod: "email",
        },
      };

      await Api.saveAutomationSetting(payload);
      
      toast.success(currentEmail ? "Accountant email updated successfully!" : "Accountant email added successfully!");
      setEmail("");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error adding accountant email:", error);
      toast.error("Failed to add accountant email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-xl font-semibold">
            {currentEmail ? "Update Accountant Email" : "Add Accountant Email"}
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Accountant Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="accountant@company.com"
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              disabled={loading}
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              Invoices will be automatically forwarded to this email address
            </p>
            {hasChanges && email.trim() && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                You have unsaved changes
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={`flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors ${
                hasChanges && email.trim()
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {currentEmail ? "Updating..." : "Adding..."}
                </>
              ) : (
                currentEmail ? "Save Changes" : "Add Email"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

