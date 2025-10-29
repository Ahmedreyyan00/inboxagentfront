"use client";

import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaSearch,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import {
  FaDownload as FaDownloadIcon,
  FaRotateRight,
  FaEye,
  FaSearchengin,
  FaSpinner,
  FaFileInvoice,
} from "react-icons/fa6";
import InvoiceDetailModal from "../Modals/InvoiceModal";
import AccountantEmailModal from "../Modals/AccountantEmailModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  InvoiceHistoryTranslations,
  ModalTranslations,
  InvoicePLaceholderTranslations,
} from "@/transalations/CommonTransaltion";
import { IInvoice } from "@/types/invoice";
import Api from "@/lib/Api";
import { toastWarn } from "@/Utils/toastCustom";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { Alert } from "../ui/alert";
import useSubscription from "@/hooks/useSubscription";
import { formatAmount } from "@/Utils/formatAmount";
import dayjs from "dayjs";
import { InvoiceTableSkeleton } from "../skeletons/TableSkeletons";
interface ISubscription {
  usage: number;
  plan: {
    maxInvoicesPerMonth: number;
  };
}

export default function InvoiceHistory() {
  const [openInvoiceModal, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [subscription, setSubscription] = useState<ISubscription | null>(null);
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const [isScanning, setIsScanning] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [markingAsPaidId, setMarkingAsPaidId] = useState<string | null>(null);
  const [openAccountantModal, setOpenAccountantModal] = useState(false);
  const [accountantEmail, setAccountantEmail] = useState<string | null>(null);
  const [loadingAccountantEmail, setLoadingAccountantEmail] = useState(true);
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = InvoiceHistoryTranslations[currentLanguage];
  const invoice = InvoicePLaceholderTranslations[currentLanguage];
  const modalT = ModalTranslations[currentLanguage];
  const { currentSubscription } = useSubscription();
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  console.log({ invoices });
  useEffect(() => {
    getInvoices();
  }, [currentPage, debouncedSearchTerm, statusFilter, dateRangeFilter]);

  // Reset to page 1 when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // Show loading when search term changes (before debounce)
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setLoading(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    getSubscription();
    fetchAccountantEmail();
  }, []);

  const fetchAccountantEmail = async () => {
    try {
      setLoadingAccountantEmail(true);
      const response = await Api.getAccountantEmail();
      if (response.data.success && response.data.accountantEmail) {
        setAccountantEmail(response.data.accountantEmail);
      }
    } catch (error) {
      console.error("Error fetching accountant email:", error);
    } finally {
      setLoadingAccountantEmail(false);
    }
  };

  const handleOpenAccountantModal = () => {
    setOpenAccountantModal(true);
  };

  const handleCloseAccountantModal = () => {
    setOpenAccountantModal(false);
  };

  const handleAccountantEmailSuccess = () => {
    fetchAccountantEmail();
  };

  const getSubscription = async () => {
    try {
      const res = await Api.getCurrentSubscription();
      setSubscription(res.data.subscription);
    } catch (error) {
      console.log(error);
    }
  };

  const isUsageLimitReached =
    subscription?.usage &&
    subscription.usage >= subscription.plan.maxInvoicesPerMonth;

  const getInvoices = async () => {
    try {
      setLoading(true);
      const res = await Api.getInvoices(
        currentPage,
        10,
        debouncedSearchTerm,
        statusFilter,
        dateRangeFilter
      );
      setInvoices(res.data.invoices || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalInvoices(res.data.pagination?.total || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateRangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRangeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const scanInvoices = async () => {
    try {
      setIsScanning(true);
      const res = await Api.scanInvoices();
      console.log(res);

      if (res.data.hasNewInvoices) {
        const message = t.scanCompletedMessage.replace(
          "{{count}}",
          res.data.totalCreated.toString()
        );
        toast.success(message);
        // Reset to first page to show new invoices
        setCurrentPage(1);
      } else {
        toastWarn(t.scanCompletedNoInvoices);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to scan invoices. Please try again.");
    } finally {
      await getInvoices();
      setIsScanning(false);
    }
  };

  const downloadInvoicePDF = async (invoice: IInvoice) => {
    try {
      // First decode the URL to handle any existing encoding, then re-encode properly
      const url = new URL(invoice.s3Url);

      // Decode the pathname to get the original characters
      const decodedPath = decodeURIComponent(url.pathname);

      // Remove leading slash and encode properly for S3
      const pathWithoutSlash = decodedPath.substring(1);

      // For S3, encode the entire filename but replace %20 with +
      const encodedPath = encodeURIComponent(pathWithoutSlash).replace(
        /%20/g,
        "+"
      );

      // Reconstruct the URL
      const safeUrl = `${url.protocol}//${url.host}/${encodedPath}`;

      console.log("Original URL:", invoice.s3Url);
      console.log("Decoded path:", decodedPath);
      console.log("Final encoded URL:", safeUrl);

      const response = await fetch(safeUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Invoice-${invoice.filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log(error);
      toast.error("Failed to download invoice. Please try again.");
    }
  };

 
  const markAsPaid = async (invoiceId: string) => {
    try {
      setMarkingAsPaidId(invoiceId);
      await Api.markInvoiceAsPaid(invoiceId);
      toast.success(modalT.invoiceMarkedAsPaid);
      // Refresh the invoices list to show updated status
      await getInvoices();
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error(modalT.failedToMarkAsPaid);
    } finally {
      setMarkingAsPaidId(null);
    }
  };

  const handleOpenInvoiceModal = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <main id="main-content" className="p-4 sm:p-8">
      {!!isUsageLimitReached && (
        <div className="mb-4">
          <Alert variant="destructive">
            <FaExclamationTriangle />
            <p>
              You have reached your usage limit. Please upgrade to to continue.
            </p>
          </Alert>
        </div>
      )}

      {!loadingAccountantEmail && !accountantEmail && (
        <div className="mb-4">
          <Alert variant="destructive">
            <FaExclamationTriangle />
            <div className="flex justify-between items-center w-full">
              <p>
                Please add an accountant email to your account to receive
                invoices.
              </p>
              <button
                onClick={handleOpenAccountantModal}
                className="px-4 py-2 rounded-lg flex items-center gap-2 border-2 transition-all hover:shadow-sm"
                style={{ 
                  backgroundColor: 'var(--card-accent)',
                  borderColor: 'var(--card-accent)',
                  color: 'white'
                }}
              >
                <FaPlus />
                Add Accountant Email
              </button>
            </div>
          </Alert>
        </div>
      )}

      <div id="page-header" className="mb-8">
        <h1 className="text-xl sm:text-2xl mb-2" style={{ color: 'var(--card-accent)' }}>{t.allInvoices}</h1>
        <p className="text-neutral-600 text-sm sm:text-base">{t.extractAutomaticallyFromGmail}</p>
      </div>

      <div
        id="filters"
        className="rounded-lg border-2 transition-all hover:shadow-md p-4 mb-6 sticky top-16 z-40"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--card-accent)' }} />
            <input
              type="text"
              placeholder={t.searchBySupplierAmountSubject}
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
              style={{ 
                borderColor: 'var(--card-border-light)',
                backgroundColor: 'white',
                '--tw-ring-color': 'var(--card-accent)'
              } as React.CSSProperties}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-3 sm:gap-4">
            <select
              className="px-3 sm:px-4 py-2 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ 
                borderColor: 'var(--card-border-light)',
                backgroundColor: 'white',
                '--tw-ring-color': 'var(--card-accent)'
              } as React.CSSProperties}
              value={dateRangeFilter}
              onChange={handleDateRangeFilter}
            >
              <option value="">All Time</option>
              <option value="7days">
                {t.Last} 7 {t.days}
              </option>
              <option value="30days">
                {t.Last} 30 {t.days}
              </option>
              <option value="90days">
                {t.Last} 90 {t.days}
              </option>
            </select>
            <select
              className="px-3 sm:px-4 py-2 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ 
                borderColor: 'var(--card-border-light)',
                backgroundColor: 'white',
                '--tw-ring-color': 'var(--card-accent)'
              } as React.CSSProperties}
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="all">{t.allStatus}</option>
              <option value="Paid">{t.Paid}</option>
              <option value="Unpaid">{t.Unpaid}</option>
              <option value="Overdue">{t.Overdue}</option>
              <option value="Partially Paid">{t.PartiallyPaid}</option>
            </select>
            <button
              disabled={
                !currentSubscription || isUsageLimitReached || isScanning
              }
              onClick={scanInvoices}
              className={`px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 border-2 transition-all hover:shadow-sm text-sm sm:text-base ${
                !currentSubscription || isUsageLimitReached
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              style={{
                backgroundColor: !currentSubscription || isUsageLimitReached ? '#f3f4f6' : 'var(--card-accent)',
                borderColor: 'var(--card-accent)',
                color: 'white'
              }}
            >
              {isScanning ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSearchengin />
              )}
              <span>{isScanning ? modalT.loading : "Scan Invoices"}</span>
            </button>
          
            <button
              onClick={handleOpenAccountantModal}
              className="px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 border-2 transition-all hover:shadow-sm text-sm sm:text-base"
              style={{ 
                backgroundColor: 'white',
                borderColor: 'var(--card-border-light)',
                color: 'var(--card-accent)'
              }}
              title={
                accountantEmail
                  ? "Update Accountant Email"
                  : "Add Accountant Email"
              }
            >
              <FaPlus />
              <span>
                {accountantEmail ? "Update Accountant" : "Add Accountant"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="invoice-table"
        className="rounded-lg border-2 transition-all hover:shadow-md overflow-x-auto"
        style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
      >
        {loading ? (
          <InvoiceTableSkeleton />
        ) : invoices.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--card-accent)' }}>
            <FaFileInvoice className="mx-auto mb-2 text-2xl" style={{ color: 'var(--card-accent)' }} />
            <p>{invoice.noInvoicesFound}</p>
            <p className="text-sm">{invoice.invoicesWillAppear}</p>
          </div>
        ) : (
          <table className="w-full min-w-[720px]">
            <thead className="border-b-2" style={{ borderColor: 'var(--card-border-light)' }}>
              <tr>
                <th className="px-4 py-3 text-left min-w-[150px]" style={{ color: 'var(--card-accent)' }}>{t.invoiceDate}</th>
                <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>{t.supplierName}</th>
                <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>{t.Amount}</th>
                <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>{t.subjectLine}</th>
                <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>{t.Status}</th>
                <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>{t.Actions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                return (
                  <tr
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: 'var(--card-border-light)' }}
                    key={invoice._id}
                  >
                    <td className="px-4 py-3" style={{ color: '#1e40af' }}>
                      {dayjs(invoice.invoiceDate).format("DD/MM/YYYY")}
                    </td>
                   
                    <td className="px-4 py-3" style={{ color: '#1e40af' }}>{invoice.supplierName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-bold" style={{ color: '#1e40af' }}>{formatAmount(invoice.parsedAmount, invoice.currency)}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#1e40af' }}>{invoice.subject}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : invoice.status === "Partially Paid"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {invoice.status || "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                       
                        <button
                          className="disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 cursor-pointer transition-opacity"
                          title="View Invoice"
                        >
                          <FaEye
                            onClick={() => handleOpenInvoiceModal(invoice)}
                            className="cursor-pointer"
                            style={{ color: '#3b82f6' }}
                          />
                        </button>
                        <button
                          onClick={() => downloadInvoicePDF(invoice)}
                          disabled={downloadingId === invoice._id}
                          className="disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 cursor-pointer transition-opacity"
                          title="Download Invoice PDF"
                        >
                          {downloadingId === invoice._id ? (
                            <FaSpinner className="animate-spin" style={{ color: '#6b7280' }} />
                          ) : (
                            <FaDownloadIcon style={{ color: '#10b981' }} />
                          )}
                        </button>
                        {invoice.status !== "Paid" && (
                          <button
                            onClick={() => markAsPaid(invoice._id)}
                            disabled={markingAsPaidId === invoice._id}
                            className="disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 cursor-pointer transition-opacity"
                            title={t.markAsPaid}
                          >
                            {markingAsPaidId === invoice._id ? (
                              <FaSpinner className="animate-spin" style={{ color: '#6b7280' }} />
                            ) : (
                              <FaCheckCircle style={{ color: '#f59e0b' }} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="p-4 flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between border-t-2" style={{ borderColor: 'var(--card-border-light)' }}>
          <div className="text-sm sm:text-base" style={{ color: 'var(--card-accent)' }}>
            {t.Showing} {Math.min((currentPage - 1) * 10 + 1, totalInvoices)}-
            {Math.min(currentPage * 10, totalInvoices)} of {totalInvoices}{" "}
            {t.invoices}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm"
              style={{ 
                borderColor: currentPage === 1 ? '#e5e7eb' : 'var(--card-accent)',
                color: currentPage === 1 ? '#9ca3af' : 'var(--card-accent)',
                backgroundColor: 'white'
              }}
            >
              {t.Previous}
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, currentPage - 2);
              const pageNumber = startPage + i;
              if (pageNumber > totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  disabled={loading}
                  className={`px-3 py-1 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    pageNumber === currentPage
                      ? "text-white"
                      : "hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: pageNumber === currentPage ? 'var(--card-accent)' : 'white',
                    borderColor: 'var(--card-accent)',
                    color: pageNumber === currentPage ? 'white' : 'var(--card-accent)'
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1 border-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-sm"
              style={{ 
                borderColor: currentPage === totalPages ? '#e5e7eb' : 'var(--card-accent)',
                color: currentPage === totalPages ? '#9ca3af' : 'var(--card-accent)',
                backgroundColor: 'white'
              }}
            >
              {t.Next}
            </button>
          </div>
        </div>
      </div>
      {openInvoiceModal && selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice!}
          onClose={handleCloseInvoiceModal}
          downloadInvoicePDF={downloadInvoicePDF}
        />
      )}

      <AccountantEmailModal
        isOpen={openAccountantModal}
        onClose={handleCloseAccountantModal}
        onSuccess={handleAccountantEmailSuccess}
        currentEmail={accountantEmail}
      />
    </main>
  );
}
