"use client";

import {
  FaCircleCheck,
  FaArrowRight,
  FaArrowsRotate,
  FaLock,
} from "react-icons/fa6";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModalTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

type ImapEmailSuccessModalProps = {
  onClose: () => void;
};

const ImapEmailSuccessModal: React.FC<ImapEmailSuccessModalProps> = ({
  onClose,
}) => {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = ModalTranslations[currentLanguage];

  return (
    <div
      id="imap-test-success-modal"
      className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative">
        {/* Optional close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition"
        >
          <IoClose size={20} />
        </button>

        {/* Header */}
        <div
          id="imap-test-success-header"
          className="flex flex-col items-center mb-8"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
            <FaCircleCheck size={32} style={{ color: "#1F2937" }} />
          </div>
          <h2 className="text-[22px] text-center" style={{ color: "#2C3E50" }}>
            {t.emailSettingsVerified}
          </h2>
          <p className="text-base text-neutral-600 text-center mt-2">
            {t.settingsVerifiedDescription}
          </p>
        </div>

        {/* Summary Details */}
        <div
          id="imap-test-details-summary"
          className="bg-neutral-50 rounded-lg px-6 py-5 mb-8 flex flex-col gap-2 border border-neutral-100"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Email</span>
            <span className="text-sm text-neutral-900">
              john.doe@example.com
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">IMAP Server</span>
            <span className="text-sm text-neutral-900">
              imap.mailprovider.com
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Port</span>
            <span className="text-sm text-neutral-900">993</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <FaRegCircleQuestion className="text-neutral-400 text-base" />
            <span className="text-xs text-neutral-500">
              {t.settingsVerifiedDescription}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div id="imap-test-actions" className="flex flex-col gap-3 mb-7">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg shadow border border-transparent bg-neutral-900 text-white px-6 py-2.5 transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <span>Continue to Scan Setup</span>
            <FaArrowRight />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-900 px-6 py-2.5 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <FaArrowsRotate />
            <span>Test Again</span>
          </button>
        </div>

        {/* Privacy Reminder */}
        <div
          id="imap-test-privacy-reminder"
          className="flex items-center gap-3 justify-center mt-2"
        >
          <FaLock className="text-neutral-400" />
          <span className="text-neutral-600 text-sm text-center">
            {t.privacyNote}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImapEmailSuccessModal;
