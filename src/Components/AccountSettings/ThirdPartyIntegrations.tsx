import React, { JSX, useEffect, useState } from "react";
import { FaPlug, FaXing, FaEnvelope, FaPlus } from "react-icons/fa6";
import { SiQuickbooks } from "react-icons/si";
import toast from "react-hot-toast";
import GmailAuthModal from "@/Components/Modals/GmailAuthModal";
import MicrosoftAuthModal from "@/Components/Modals/MicrosoftAuthModal";
import OtherEmailModal from "@/Components/Modals/OtherEmailModal";
import useEmailConnected from "@/hooks/useEmailConnected";
import { useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import MicrosoftColorIcon from "@/Components/Icons/MicrosoftColorIcon";
import ImapIcon from "@/Components/Icons/ImapIcon";

interface ThirdPartyService {
  name: string;
  icon: JSX.Element;
  key: "google" | "microsoft" | "imap" | "quickbooks" | "xero";
}

interface EmailAccount {
  email: string;
  isActive: boolean;
  connected?: boolean;
}

interface Props {
  t: any;
}

export default function ThirdPartyIntegrations({ t }: Props) {
  const { emailStatus, loading, disconnectGmail, disconnectMicrosoft, refresh } =
  useEmailConnected();

  const [showGmailModal, setShowGmailModal] = useState(false);
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);
  const [showOtherEmailModal, setShowOtherEmailModal] = useState(false);

  const thirdPartyServices: ThirdPartyService[] = [
    { name: "Gmail", icon: <FcGoogle />, key: "google" },
    { name: "Microsoft", icon: <MicrosoftColorIcon size={20} />, key: "microsoft" },
    { name: "Other Email", icon: <ImapIcon size={20} />, key: "imap" },
    { name: "QuickBooks", icon: <SiQuickbooks />, key: "quickbooks" },
    { name: "Xero", icon: <FaXing />, key: "xero" },
  ];

  const handleAction = (service: ThirdPartyService) => {
    switch (service.key) {
      case "google":
        setShowGmailModal(true);
        break;
      case "microsoft":
        setShowMicrosoftModal(true);
        break;
      case "imap":
        setShowOtherEmailModal(true);
        break;
      default:
        toast.success(`${service.name} integration coming soon!`);
    }
  };

  const handleDisconnectAccount = async (service: ThirdPartyService, email: string) => {
    try {
      if (service.key === "google") {
        await disconnectGmail(email);
        toast.success("Gmail account disconnected successfully");
      } else if (service.key === "microsoft") {
        await disconnectMicrosoft(email);
        toast.success("Microsoft account disconnected successfully");
      } else {
        toast.error("Disconnect functionality not implemented yet");
      }
    } catch (error) {
      toast.error("Failed to disconnect account");
    }
  };

  const getAccountsForService = (service: ThirdPartyService): EmailAccount[] => {
    if (loading || !emailStatus) return [];
    
    switch (service.key) {
      case "google":
        return emailStatus.google || [];
      case "microsoft":
        return emailStatus.microsoft || [];
      case "imap":
        return emailStatus.imap || [];
      default:
        return [];
    }
  };

  const getServiceStatus = (service: ThirdPartyService) => {
    if (loading) return t.loading;
    
    const accounts = getAccountsForService(service);
    if (accounts.length === 0) return t.disconnected;
    
    const activeAccounts = accounts.filter(account => account.isActive);
    if (activeAccounts.length === 0) return t.disconnected;
    
    return `${activeAccounts.length} connected`;
  };

  const getAccountStatus = (account: EmailAccount) => {
    if (account.isActive) {
      return account.connected !== false ? t.connected : t.disconnected;
    }
    return t.disconnected;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case t.connected:
        return "bg-green-100 text-green-700";
      case t.disconnected:
        return "bg-red-100 text-red-700";
      case t.loading:
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-neutral-100 text-neutral-500";
    }
  };

  return (
    <section className="bg-white rounded-lg border border-neutral-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">{t.thirdPartyIntegrations}</h2>
      </div>
      <p className="text-neutral-600 mb-6">{t.thirdPartySubHeading}</p>
      
      <div className="space-y-6">
        {thirdPartyServices.map((service) => {
          const accounts = getAccountsForService(service);
          const serviceStatus = getServiceStatus(service);
          const hasActiveAccounts = accounts.some(account => account.isActive);

          return (
            <div key={service.name} className="border border-neutral-200 rounded-lg p-4">
              {/* Service Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {service.icon}
                  <span className="font-medium">{service.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(serviceStatus)}`}>
                    {serviceStatus}
                  </span>
                </div>
                <button
                  className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 flex items-center gap-2 hover:bg-neutral-50 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleAction(service)}
                  disabled={loading || service.key === "xero" || service.key === "quickbooks"}
                >
                  <FaPlus className="text-sm" />
                  {service.key === "xero" || service.key === "quickbooks" ? t.comingSoon : t.connectNewAccount}
                </button>
              </div>

              {/* Connected Accounts */}
              {accounts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-neutral-700">
                    Connected Accounts ({accounts.length})
                  </h4>
                  {accounts.map((account, index) => {
                    const accountStatus = getAccountStatus(account);
                    return (
                      <div
                        key={`${account.email}-${index}`}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
                          <span className="text-sm text-neutral-700">{account.email}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(accountStatus)}`}>
                            {accountStatus}
                          </span>
                        </div>
                        {account.isActive && (
                          <button
                className={`px-3 py-1 border border-neutral-200 rounded-lg text-neutral-700 cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}                            onClick={() => handleDisconnectAccount(service, account.email)}
                            disabled={loading}
                          >
                            Disconnected
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No Accounts Message */}
              {accounts.length === 0 && (
                <div className="text-center py-4 text-neutral-500 text-sm">
                  No {service.name} accounts connected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showGmailModal && (
        <GmailAuthModal
          onClose={() => {
            setShowGmailModal(false);
            refresh();
          }}
          isConnected={!!emailStatus?.google?.some(account => account.isActive)}
          emails={emailStatus?.google?.map(account => account.email) || []}
          mailBoxLimitReached={false}
        />
      )}

      {showMicrosoftModal && (
        <MicrosoftAuthModal
          onClose={() => {
            setShowMicrosoftModal(false);
            refresh();
          }}
          isConnected={!!emailStatus?.microsoft?.some(account => account.isActive)}
          emails={emailStatus?.microsoft?.map(account => account.email) || []}
          mailBoxLimitReached={false}
        />
      )}

      {showOtherEmailModal && (
        <OtherEmailModal
          onClose={() => {
            setShowOtherEmailModal(false);
            refresh();
          }}
          showEmailFailureModal={() => {}}
          isConnected={!!emailStatus?.imap?.some(account => account.isActive)}
          emails={emailStatus?.imap?.map(account => account.email) || []}
          mailBoxLimitReached={false}
        />
      )}
    </section>
  );
}