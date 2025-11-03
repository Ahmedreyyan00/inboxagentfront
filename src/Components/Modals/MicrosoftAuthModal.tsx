"use client";
import MicrosoftColorIcon from "@/Components/Icons/MicrosoftColorIcon";

import { FaExclamationTriangle } from 'react-icons/fa';
import { FaXmark, FaShieldHalved, FaRegCircleQuestion } from 'react-icons/fa6';
import React from 'react';
import Api from '@/lib/Api';
import { toast } from 'react-hot-toast';
import { MicrosoftAuthModalTranslation } from '@/transalations/CommonTransaltion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { isValidLanguageCode } from '@/Utils/languageUtils';

interface MicrosoftAccount {
  email: string;
  isActive: boolean;
  isReauthRequired?: boolean;
}

interface MicrosoftAuthModalProps {
  onClose: () => void;
  isConnected: boolean;
  emails: string[];
  microsoftAccounts?: MicrosoftAccount[];
  mailBoxLimitReached: Boolean;
}

const MicrosoftAuthModal: React.FC<MicrosoftAuthModalProps> = ({ onClose, isConnected, emails, microsoftAccounts, mailBoxLimitReached }) => {



const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
   const currentLanguage = isValidLanguageCode(language) ? language : "en";
        const t = MicrosoftAuthModalTranslation[currentLanguage];


  const handleMicrosoftAuth = async () => {
    try {
      const response = await Api.microsoftAuth();
      window.location.href = response.data.url;
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDisconnect = async (email: string) => {
    try {
      const response = await Api.disconnectMicrosoft(email);
      console.log({response})
      toast.success(`Microsoft account ${email} ${t.disconnectSuccess}`);
      onClose();
    } catch (error) {
      console.log({error});
      toast.error(t.disconnectError);
    }
  };

  return (
    <div
      id="microsoft-auth-modal"
      className="fixed inset-0 bg-neutral-900/60 flex items-end sm:items-center justify-center z-50"
    >
      <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-2xl p-4 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-neutral-500 hover:text-neutral-800 transition"
          aria-label={t.closeModal}
        >
          <FaXmark className="text-xl sm:text-2xl" />
        </button>

        <div
          id="microsoft-branding-block"
          className="flex flex-col items-center mb-8"
        >
          <div
            className="mb-4 flex items-center justify-center"
            style={{ width: "48px", height: "48px" }}
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-1 w-10 h-10">
              <div className="rounded" style={{ width: "18px", height: "18px", backgroundColor: '#F25022' }}></div>
              <div className="rounded" style={{ width: "18px", height: "18px", backgroundColor: '#7FBA00' }}></div>
              <div className="rounded" style={{ width: "18px", height: "18px", backgroundColor: '#00A4EF' }}></div>
              <div className="rounded" style={{ width: "18px", height: "18px", backgroundColor: '#FFB900' }}></div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl mb-2 text-center text-neutral-900">
            {isConnected ? t.microsoftAccountConnectionStatus : t.connectYourMicrosoftEmailSecurely}
          </h2>
          <p className="text-neutral-600 text-center text-sm sm:text-base mb-2">
            {isConnected 
              ? t.manageConnectedAccounts
              : t.accountNotConnected
            }
          </p>
        </div>

        {/* Connected Emails List */}
        {isConnected && emails.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
              {t.connectedAccounts} ({emails.length})
            </h3>
            <div className="space-y-3">
              {emails.map((email, index) => {
                const accountInfo = microsoftAccounts?.find((acc) => acc.email === email);
                const needsReauth = accountInfo?.isReauthRequired;
                
                return (
                  <div key={index}>
                    <div
                      className={`flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between p-3 rounded-lg border ${
                        needsReauth 
                          ? 'bg-amber-50 border-amber-300' 
                          : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-5 h-5">
                          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-4 h-4">
                            <div className="rounded w-1.5 h-1.5" style={{ backgroundColor: '#F25022' }}></div>
                            <div className="rounded w-1.5 h-1.5" style={{ backgroundColor: '#7FBA00' }}></div>
                            <div className="rounded w-1.5 h-1.5" style={{ backgroundColor: '#00A4EF' }}></div>
                            <div className="rounded w-1.5 h-1.5" style={{ backgroundColor: '#FFB900' }}></div>
                          </div>
                        </div>
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
                        {t.disconnect}
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
              {t.noAccountsConnected}
            </p>
          </div>
        )}

        {/* Connect New Email Button */}
       {!mailBoxLimitReached && <button
          className="w-full flex items-center justify-center gap-3 rounded-lg px-6 py-3 shadow text-white text-sm sm:text-base transition mb-6"
          style={{ backgroundColor: '#0078D4' }}
          onClick={handleMicrosoftAuth}
        >
          <span className="inline-block mr-2">
            <MicrosoftColorIcon size={20} />
          </span>
          <span>
            {isConnected ? t.connectNewMicrosoftAccount : t.authorizeWithMicrosoft}
          </span>
        </button>}

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
                  You have reached the maximum number of mailboxes allowed for your current plan. 
                  Please upgrade your subscription to connect more Microsoft accounts.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 justify-center mb-3">
          <FaShieldHalved className="text-neutral-400" />
          <span className="text-neutral-600 text-sm">
           {t.passwordNote}
          </span>
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

export default MicrosoftAuthModal;