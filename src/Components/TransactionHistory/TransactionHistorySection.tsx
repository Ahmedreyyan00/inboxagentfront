"use client";

import { useEffect, useState } from "react";
import { FaSpinner, FaCreditCard, FaDownload, FaEye } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { TransactionHistoryTranslations } from "@/transalations/CommonTransaltion";
import { formatAmount } from "@/Utils/formatAmount";

interface ITransaction {
  _id: string;
  subscription: {
    _id: string;
    plan: {
      name: string;
      price: number;
    };
  };
  amount: number;
  status: string;
  createdAt: string;
  stripeTransactionId: string;
  user: string;
  invoicePdf?: string;
  invoiceUrl?: string;
  updatedAt: string;
}

interface TransactionHistorySectionProps {
  showFullHistory?: boolean;
  maxTransactions?: number;
}

export default function TransactionHistorySection({ 
  showFullHistory = false, 
  maxTransactions = 5 
}: TransactionHistorySectionProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = TransactionHistoryTranslations[currentLanguage];

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    getTransactions();
  }, [debouncedSearchTerm, statusFilter, dateRangeFilter, currentPage]);

  const getTransactions = async () => {
    try {
      setLoading(true);
      const res = await Api.getAllTransactions(
        currentPage,
        showFullHistory ? 10 : maxTransactions,
        debouncedSearchTerm,
        statusFilter !== "all" ? statusFilter : "",
        dateRangeFilter
      );

      if (res.data && res.data.transactions) {
        setTransactions(res.data.transactions);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalTransactions(res.data.pagination?.totalTransactions || 0);
      } else {
        setTransactions([]);
        setTotalPages(1);
        setTotalTransactions(0);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(t.failedToDownloadTransactions);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleDateRangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRangeFilter(e.target.value);
  };

  const downloadTransactionPDF = async (transaction: ITransaction) => {
    if (!transaction.invoicePdf) {
      toast.error(t.noPDFAvailable);
      return;
    }

    try {
      setDownloadingId(transaction._id);
      window.open(transaction.invoicePdf, "_blank");
      toast.success(t.transactionPDFDownloaded);
      return;
    } catch (error) {
      console.error("Error downloading transaction PDF:", error);
      toast.error(t.failedToDownloadPDF);
    } finally {
      setDownloadingId(null);
    }
  };

  const openStripeReceiptsPage = async (transaction: ITransaction) => {
    if (!transaction.invoiceUrl) {
      return;
    }
    window.open(transaction.invoiceUrl, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
      case "paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "failed":
      case "declined":
        return "bg-red-50 text-red-700 border border-red-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-neutral-50 text-neutral-700 border border-neutral-200";
    }
  };

  return (
    <div className="rounded-xl border-2 shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
      {/* Header */}
      <div className="p-6 border-b-2" style={{ borderColor: 'var(--card-border-light)' }}>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-accent)' }}>
          {t.transactionHistory}
        </h3>
        <p className="text-neutral-600">
          {showFullHistory 
            ? t.viewAllPaymentTransactions 
            : "Recent payment transactions and receipts"
          }
        </p>
      </div>

      {/* Filters - Only show if full history */}
      {showFullHistory && (
        <div className="p-6 border-b-2" style={{ borderColor: 'var(--card-border-light)', backgroundColor: 'var(--card-bg-medium)' }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex-1 relative w-full lg:w-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--card-accent)' }} />
              <input
                type="text"
                placeholder={t.searchByTransactionId}
                className="w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base transition-all"
                style={{ borderColor: 'var(--card-border-light)' }}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <select
                className="px-4 py-3 border-2 rounded-xl text-base transition-all"
                style={{ borderColor: 'var(--card-border-light)' }}
                value={dateRangeFilter}
                onChange={handleDateRangeFilter}
              >
                <option value="">{t.allTime}</option>
                <option value="7">{t.last7Days}</option>
                <option value="30">{t.last30Days}</option>
                <option value="90">{t.last90Days}</option>
              </select>
              <select
                className="px-4 py-3 border-2 rounded-xl text-base transition-all"
                style={{ borderColor: 'var(--card-border-light)' }}
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <option value="all">{t.allStatus}</option>
                <option value="succeeded">{t.succeeded}</option>
                <option value="failed">{t.failed}</option>
                <option value="pending">{t.pending}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <FaSpinner className="animate-spin mr-3 text-2xl text-neutral-400" />
            <span className="text-lg text-neutral-600">
              {t.loadingTransactions}
            </span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--card-accent)' }}>
            <FaCreditCard className="mx-auto mb-4 text-4xl" style={{ color: 'var(--card-accent)', opacity: 0.5 }} />
            <p className="text-xl font-medium mb-2">{t.noTransactionsFound}</p>
            <p className="text-base" style={{ opacity: 0.7 }}>{t.transactionsWillAppear}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--card-bg-medium)' }}>
              <tr className="border-b-2" style={{ borderColor: 'var(--card-border-light)' }}>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--card-accent)' }}>
                  {t.transactionDate}
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--card-accent)' }}>
                  {t.transactionId}
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--card-accent)' }}>
                  {t.plan}
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--card-accent)' }}>
                  {t.amount}
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--card-accent)' }}>
                  {t.status}
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: 'var(--card-accent)' }}>
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  className="border-b transition-colors duration-200 hover:bg-gray-50"
                  style={{ borderColor: 'var(--card-border-light)' }}
                  key={transaction._id}
                >
                  <td className="px-6 py-4 text-base">
                    <div className="font-medium" style={{ color: '#1e40af' }}>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm px-3 py-1 rounded-lg inline-block" style={{ backgroundColor: 'var(--card-bg-medium)' }}>
                      {transaction.stripeTransactionId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium" style={{ color: '#1e40af' }}>
                      {transaction.subscription.plan.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg" style={{ color: '#1e40af' }}>
                      {formatAmount(transaction.amount, 'USD')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadTransactionPDF(transaction)}
                        disabled={
                          downloadingId === transaction._id ||
                          !transaction.invoicePdf
                        }
                        className={`p-2 rounded-lg transition-colors duration-200 group ${
                          transaction.invoicePdf
                            ? "cursor-pointer"
                            : "opacity-30 cursor-not-allowed"
                        }`}
                        style={{
                          backgroundColor: transaction.invoicePdf ? 'var(--card-bg-medium)' : 'transparent'
                        }}
                        title={
                          transaction.invoicePdf
                            ? t.downloadTransactionPDF
                            : t.noPDFAvailable
                        }
                      >
                        {downloadingId === transaction._id ? (
                          <FaSpinner className="animate-spin text-neutral-600 text-lg" />
                        ) : (
                          <FaDownload
                            className={`text-lg ${
                              transaction.invoicePdf
                                ? "text-neutral-600 group-hover:text-neutral-800"
                                : "text-neutral-400"
                            }`}
                          />
                        )}
                      </button>
                      
                      <button
                        onClick={() => openStripeReceiptsPage(transaction)}
                        disabled={!transaction.invoiceUrl}
                        className={`p-2 rounded-lg transition-colors duration-200 group ${
                          transaction.invoiceUrl
                            ? "cursor-pointer"
                            : "opacity-30 cursor-not-allowed"
                        }`}
                        style={{
                          backgroundColor: transaction.invoiceUrl ? 'var(--card-bg-medium)' : 'transparent'
                        }}
                        title={
                          transaction.invoiceUrl
                            ? t.viewStripeReceipt
                            : t.noStripeReceipt
                        }
                      >
                        <FaEye
                          className={`text-lg ${
                            transaction.invoiceUrl
                              ? "text-neutral-600 group-hover:text-neutral-800"
                              : "text-neutral-400"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination - Only show if full history */}
      { totalPages > 1 && (
        <div className="p-6 flex items-center justify-between border-t-2" style={{ borderColor: 'var(--card-border-light)' }}>
          <div style={{ color: 'var(--card-accent)' }}>
            {t.Showing}{" "}
            {Math.min((currentPage - 1) * 5 + 1, totalTransactions)}-
            {Math.min(currentPage * 5, totalTransactions)} of{" "}
            {totalTransactions} {t.transactions}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:shadow-sm"
              style={{ 
                borderColor: currentPage === 1 ? '#e5e7eb' : 'var(--card-border-light)',
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
                  className={`px-4 py-2 rounded-xl transition-colors hover:shadow-sm ${
                    pageNumber === currentPage
                      ? ""
                      : "border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor: pageNumber === currentPage ? 'var(--card-accent)' : 'white',
                    borderColor: pageNumber === currentPage ? 'var(--card-accent)' : 'var(--card-border-light)',
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
              className="px-4 py-2 border-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:shadow-sm"
              style={{ 
                borderColor: currentPage === totalPages ? '#e5e7eb' : 'var(--card-border-light)',
                color: currentPage === totalPages ? '#9ca3af' : 'var(--card-accent)',
                backgroundColor: 'white'
              }}
            >
              {t.Next}
            </button>
          </div>
        </div>
      )}

      {/* View All Link - Only show if not full history */}
      {/* {!showFullHistory && totalTransactions > maxTransactions && (
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="text-center">
            <a
              href="/transactions"
              className="inline-flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              View all {totalTransactions} transactions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      )} */}
    </div>
  );
}
