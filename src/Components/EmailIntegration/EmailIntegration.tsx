"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaEnvelope, FaCircleQuestion, FaChevronDown, FaLock } from "react-icons/fa6";
import GmailAuthModal from "../Modals/GmailAuthModal";
import MicrosoftAuthModal from "../Modals/MicrosoftAuthModal";
import OtherEmailModal from "../Modals/OtherEmailModal";
import RecentSyncsCard from "./RecentSyncs";
import EmailFailureModal from "../Modals/EmailFailureModal";
import ImapEmailConnectedModal from "../Modals/ImapEmailConnectedModal";
import ImapEmailSuccessModal from "../Modals/ImapEmailSuccessModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { EmailIntegrationTranslations } from "@/transalations/CommonTransaltion";
import useEmailConnected from "@/hooks/useEmailConnected";
import Api from "@/lib/Api";
import { RecentSyncsSkeleton } from "../skeletons/TableSkeletons";
import { FcGoogle } from "react-icons/fc";
import MicrosoftColorIcon from "../Icons/MicrosoftColorIcon";

interface ISync {
  _id: string;
  user: string;
  numberOfEmailsScanned: number;
  invoicesFound: number;
  status: "pending" | "in_progress" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export default function EmailIntegration() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);
  const [showOtherEmailModal, setShowOtherEmailModal] = useState(false);
  const [showEmailFailureModal, setShowEmailFailureModal] = useState(false);
  const [showImapEmailModal, setShowImapEmailModal] = useState(false);
  const [showImapEmailSucessModal, setShowImapEmailSucessModal] =
    useState(false);
  const [recentSyncs, setRecentSyncs] = useState<ISync[]>([]);
  const [mailBoxLimitReached, setMailBoxLimitReached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [cachedEmails, setCachedEmails] = useState<any[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [showRecent, setShowRecent] = useState(true);
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const { emailStatus, refresh } = useEmailConnected();
  console.log({ emailStatus });
  const t = EmailIntegrationTranslations[language as "en" | "fr" | "nl"];

  const fetchEmailBoxLimit = async () => {
    const response = await Api.getEmailBoxLimitReached();
    if (response.data.isLimitReached) {

      setMailBoxLimitReached(true);
    }
  }

  useEffect(() => {
    fetchEmailBoxLimit();
    fetchRecentSyncs();
    fetchCachedEmails();
  }, []);

  const fetchRecentSyncs = async () => {
    try {
      setLoading(true);
      const response = await Api.getRecentSyncs();
      setRecentSyncs(response.data.syncs || []);
    } catch (error) {
      console.error("Error fetching recent syncs:", error);
      setRecentSyncs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatSyncDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Unknown date";
    }
  };

  const fetchCachedEmails = async () => {
    try {
      const response = await Api.getCachedEmails();
      setCachedEmails(response.data.emails || []);
    } catch (e) {
      console.error("Failed to load cached emails", e);
      setCachedEmails([]);
    }
  };

  const handleScanGmail = async () => {
    try {
      setScanning(true);
      await Api.scanAndCacheEmails(10);
      await fetchCachedEmails();
    } catch (e) {
      console.error("Scan failed", e);
    } finally {
      setScanning(false);
    }
  };

  const getSyncIcon = (status: string) => {
    switch (status) {
      case "completed":
        return FaCheckCircle;
      case "failed":
        return FaExclamationTriangle;
      case "in_progress":
        return FaCheckCircle; // or could use a spinner icon
      default:
        return FaCheckCircle;
    }
  };

  const getSyncDescription = (sync: ISync) => {
    if (sync.status === "failed") {
      return "Sync failed - please check your connection";
    }
    return `${sync.numberOfEmailsScanned} emails scanned • ${sync.invoicesFound} invoices found`;
  };

  const handleDownloadSync = async (syncId: string) => {
    try {
      setDownloading(syncId);
      const response = await Api.downloadSyncPDF(syncId);

      // Extract filename from headers or create a default one
      const contentDisposition = response.headers["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `sync-report-${syncId.slice(-6)}.pdf`;

      // Create blob link to download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading sync report:", error);
      // You might want to show a toast notification here
    } finally {
      setDownloading(null);
    }
  };

  return (
    <main id="main-content" className="flex-1 p-4 sm:p-8">
      <div id="page-header" className="mb-8">
        <h1 className="text-xl sm:text-2xl mb-2" style={{ color: 'var(--card-accent)' }}>{t.emailIntegration}</h1>
        <p className="text-neutral-600 text-sm sm:text-base">{t.emailIntegrationDesc}</p>
      </div>

      <div
        id="email-connection"
        className="rounded-lg border-2 transition-all hover:shadow-md p-4 sm:p-6 mb-8"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        {/* First-Time Connection View */}
        <div id="connect-options">
          <h2 className="text-xl mb-3" style={{ color: 'var(--card-accent)' }}>{t.yourEmailConnection}</h2>
          <p className="text-neutral-600 mb-6 text-sm sm:text-base">{t.yourEmailConnectionDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <button
              onClick={() => {
                setShowEmailModal(true);
              }}
              className="flex cursor-pointer items-center gap-2 px-5 py-3 border-2 rounded-lg w-full sm:w-1/3 justify-center group transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'white' }}
            >
              <FcGoogle className="text-2xl" style={{ color: 'var(--card-accent)' }} />
              <span style={{ color: 'var(--card-accent)' }}>Gmail</span>
              {emailStatus?.google?.some((google) => google.isActive && !google.isReauthRequired) && (
                <div className="text-green-600">Connected</div>
              )}
              {emailStatus?.google?.some((google) => google.isReauthRequired) && (
                <div className="flex items-center gap-1 text-amber-600">
                  <FaExclamationTriangle className="text-sm" />
                  <span className="text-xs font-medium">Reconnect</span>
                </div>
              )}
            </button>
            {/*
            <button
              onClick={() => setShowMicrosoftModal(true)}
              className="flex cursor-pointer items-center gap-2 px-5 py-3 border-2 rounded-lg w-full sm:w-1/3 justify-center group transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'white' }}
            >
              <MicrosoftColorIcon size={24} />
              <span style={{ color: 'var(--card-accent)' }}>Microsoft</span>
              {emailStatus?.microsoft?.some((microsoft) => microsoft.isActive && !microsoft.isReauthRequired) && (
                <div className="text-green-600">Connected</div>
              )}
              {emailStatus?.microsoft?.some((microsoft) => microsoft.isReauthRequired) && (
                <div className="flex items-center gap-1 text-amber-600">
                  <FaExclamationTriangle className="text-sm" />
                  <span className="text-xs font-medium">Reconnect</span>
                </div>
              )}
            </button>
            <button
              onClick={() => setShowOtherEmailModal(true)}
              className="flex cursor-pointer items-center gap-2 px-5 py-3 border-2 rounded-lg w-full sm:w-1/3 justify-center group transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'white' }}
            >
              <FaEnvelope className="text-2xl" style={{ color: 'var(--card-accent)' }} />
              <span style={{ color: 'var(--card-accent)' }}>Other</span>
              {emailStatus?.imap?.some((imap) => imap.isActive) && (
                <div className="text-green-600">Connected</div>
              )}
            </button>
            */}
          </div>
          {emailStatus?.google?.some((google) => google.isActive && !google.isReauthRequired) && (
            <div className="mb-4">
              <button
                onClick={handleScanGmail}
                disabled={scanning}
                className="px-4 py-2 border-2 rounded-lg transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--card-border-light)', color: 'var(--card-accent)', backgroundColor: 'white' }}
              >
                {scanning ? 'Scanning…' : 'Scan Gmail (latest 10)'}
              </button>
            </div>
          )}
          {emailStatus?.google?.some((google) => google.isReauthRequired) && (
            <div className="mb-4 p-4 rounded-lg border-2 border-amber-200 bg-amber-50 flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-900 font-medium text-sm mb-1">
                  Gmail Connection Expired
                </p>
                <p className="text-amber-800 text-sm">
                  Your Gmail connection has expired. Please click on Gmail above, disconnect your account, and then reconnect it to continue syncing invoices.
                </p>
              </div>
            </div>
          )}
          {emailStatus?.microsoft?.some((microsoft) => microsoft.isReauthRequired) && (
            <div className="mb-4 p-4 rounded-lg border-2 border-amber-200 bg-amber-50 flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-900 font-medium text-sm mb-1">
                  Microsoft Connection Expired
                </p>
                <p className="text-amber-800 text-sm">
                  Your Microsoft connection has expired. Please click on Microsoft above, disconnect your account, and then reconnect it to continue syncing invoices.
                </p>
              </div>
            </div>
          )}
          <div className="text-xs text-neutral-500 mt-2">
            {t.disclaimerSmartle}
          </div>
        </div>
        {/* END First-Time Connection View */}

        {/* BEGIN: Post-Connection View (for Gmail, visible after connect) */}
        <div id="post-connection-gmail" className="hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex cursor-pointer items-center gap-4">
              <FcGoogle className="text-4xl" style={{ color: 'var(--card-accent)' }} />
              <div>
                <h2 className="text-xl" style={{ color: 'var(--card-accent)' }}>{t.yourEmailConnection}</h2>
                <p className="text-neutral-600">john.doe@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--card-accent)' }}></div>
              <span style={{ color: 'var(--card-accent)' }}>Connected</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 border-2 rounded-lg transition-all hover:shadow-sm" style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'white' }}>
              <div className="text-sm text-neutral-600">Last scan</div>
              <div style={{ color: 'var(--card-accent)' }}>Today at 10:22 AM</div>
            </div>
            <div className="p-4 border-2 rounded-lg transition-all hover:shadow-sm" style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'white' }}>
              <div className="text-sm text-neutral-600">
                Next scheduled scan
              </div>
              <div style={{ color: 'var(--card-accent)' }}>Friday, 9:00 AM</div>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <button className="px-4 py-2 border-2 rounded-lg transition-all hover:shadow-sm" style={{ borderColor: 'var(--card-border-light)', color: 'var(--card-accent)' }}>
              Disconnect Gmail
            </button>
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Smartle only reads invoices. Your emails remain private.
          </div>
        </div>
      </div>
      {/* Cached emails list */}
      <div
        id="cached-emails"
        className="rounded-lg border-2 transition-all hover:shadow-md p-4 sm:p-6 mb-8"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        <h2 className="text-xl mb-4" style={{ color: 'var(--card-accent)' }}>Recent Emails (from cache)</h2>
        {cachedEmails.length === 0 ? (
          <div className="text-neutral-600 text-sm">No cached emails yet. Click "Scan Gmail" to fetch the latest 10.</div>
        ) : (
          <div className="space-y-3">
            {cachedEmails.map((e, idx) => (
              <div key={`${e.id}-${idx}`} className="p-3 border rounded" style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'white' }}>
                <div className="text-sm" style={{ color: 'var(--card-accent)' }}>{e.subject || '(no subject)'}</div>
                <div className="text-xs text-neutral-600">{e.from}</div>
                <div className="text-xs text-neutral-500">{e.date ? new Date(e.date).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        id="sync-activity"
        className="rounded-lg border-2 transition-all hover:shadow-md p-4 sm:p-6 mb-8"
        style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}
      >
        <div
          className="flex items-center justify-between mb-4 cursor-pointer select-none"
          onClick={() => setShowRecent((prev) => !prev)}
          aria-expanded={showRecent}
          role="button"
        >
          <h2 className="text-xl" style={{ color: 'var(--card-accent)' }}>{t.recentSyncs}</h2>
          <FaChevronDown
            className={`transition-transform duration-200 ${showRecent ? 'rotate-0' : '-rotate-90'}`}
            style={{ color: 'var(--card-accent)' }}
          />
        </div>
        {showRecent && (
        <div className="space-y-4">
          {loading ? (
            <RecentSyncsSkeleton />
          ) : recentSyncs.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--card-accent)' }}>
              <FaCheckCircle className="mx-auto mb-2 text-2xl" style={{ color: 'var(--card-accent)' }} />
              <p>{t.noSyncHistoryFound}</p>
              <p className="text-sm">
                {t.syncHistoryNote}
              </p>
            </div>
          ) : (
            recentSyncs.map((sync) => (
              <RecentSyncsCard
                key={sync._id}
                Icon={getSyncIcon(sync.status)}
                timeAndDate={formatSyncDate(sync.createdAt)}
                desc={getSyncDescription(sync)}
                btnText={t.downloadFullLog}
                syncId={sync._id}
                onDownload={handleDownloadSync}
                isDownloading={downloading === sync._id}
              />
            ))
          )}
        </div>
        )}
      </div>
      <div
        id="security-notice"
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg border-2 transition-all hover:shadow-sm"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        <FaLock className="text-2xl" style={{ color: 'var(--card-accent)' }} />
        <p className="text-neutral-600 text-sm sm:text-base">{t.useSecureOauth}</p>
      </div>
      {showEmailModal && (
        <GmailAuthModal
          mailBoxLimitReached={mailBoxLimitReached}
          onClose={() => {
            setShowEmailModal(false);
            refresh();
          }}
          isConnected={!!emailStatus?.google?.some((google) => google.isActive)}
          emails={emailStatus?.google?.map((google) => google.email) || []}
          googleAccounts={emailStatus?.google || []}
        />
      )}

      {showMicrosoftModal && (
        <MicrosoftAuthModal
          mailBoxLimitReached={mailBoxLimitReached}
          onClose={() => {
            setShowMicrosoftModal(false);
            refresh();
          }}
          isConnected={!!emailStatus?.microsoft?.some((microsoft) => microsoft.isActive)}
          emails={emailStatus?.microsoft?.map((microsoft) => microsoft.email) || []}
          microsoftAccounts={emailStatus?.microsoft || []}
        />
      )}

      {showOtherEmailModal && (
        <OtherEmailModal
          mailBoxLimitReached={mailBoxLimitReached}
          showEmailFailureModal={() => {
            setShowEmailFailureModal(true);
            setShowOtherEmailModal(false);
          }}
          emails={emailStatus?.imap?.map((imap) => imap.email) || []}
          onClose={() => {
            setShowOtherEmailModal(false);
            refresh();
          }}
          isConnected={!!emailStatus?.imap?.some((imap) => imap.isActive)}
        />
      )}

      {showEmailFailureModal && (
        <EmailFailureModal
          showImapEmailConnected={() => {
            setShowEmailFailureModal(false);
            setShowImapEmailModal(true);
          }}
          onClose={() => {
            setShowEmailFailureModal(false);
            refresh();
          }}
        />
      )}

      {showImapEmailModal && (
        <ImapEmailConnectedModal onClose={() => setShowImapEmailModal(false)} />
      )}

      {showImapEmailSucessModal && (
        <ImapEmailSuccessModal
          onClose={() => setShowImapEmailSucessModal(false)}
        />
      )}
    </main>
  );
}
