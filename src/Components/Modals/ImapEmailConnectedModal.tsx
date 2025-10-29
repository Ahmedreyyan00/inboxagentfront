'use client';

import { FC } from 'react';
import {
  FaCircleCheck,
  FaLock,
  FaPause,
  FaXmark,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ModalTranslations } from '@/transalations/CommonTransaltion';
import { isValidLanguageCode } from '@/Utils/languageUtils';

interface ImapEmailConnectedModalProps {
  onClose: () => void;
}

const ImapEmailConnectedModal: FC<ImapEmailConnectedModalProps> = ({ onClose }) => {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = ModalTranslations[currentLanguage];

  return (
    <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
            <FaCircleCheck className="text-4xl text-neutral-800" />
          </div>
          <h2 className="text-2xl text-center text-neutral-900 mb-2">{t.imapEmailConnected}</h2>
          <p className="text-base text-neutral-600 text-center">
            {t.scanningInboxDescription}
          </p>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full flex flex-col items-center gap-2 mb-4">
            <div className="relative w-full h-3 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-3 rounded-full bg-neutral-800 transition-all"
                style={{ width: '45%' }}
              />
            </div>
            <span className="text-sm text-neutral-800">{t.scanningEmails} 45% {t.complete}</span>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>{t.emailsScanned}</span>
              <span className="text-neutral-900">1,250</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>{t.invoicesFound}</span>
              <span className="text-neutral-900">17</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>{t.estimatedTimeRemaining}</span>
              <span className="text-neutral-900">~3 minutes</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mb-8">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-800 px-6 py-2.5 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <FaPause />
            {t.pauseScan}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 text-neutral-700 px-6 py-2.5 transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <FaXmark className="text-neutral-600" />
            <span className="text-neutral-600">{t.cancelSetup}</span>
          </button>
        </div>

        {/* Footer Privacy Note */}
        <div className="flex items-center gap-3 justify-center mt-4">
          <FaLock className="text-neutral-400" />
          <span className="text-neutral-600 text-sm">
            {t.privacyNote}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImapEmailConnectedModal;
