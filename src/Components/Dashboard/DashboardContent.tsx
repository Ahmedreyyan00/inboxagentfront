'use client'
import { RootState } from "@/redux/store";
import {
  DashboardTranslations,
  ModalTranslations,
  InvoicePLaceholderTranslations,
} from "@/transalations/CommonTransaltion";
import { formatDateHumanReadable } from "@/Utils/formatDate";
import { useEffect, useState } from "react";
import { FaExclamationTriangle, FaSearch } from "react-icons/fa";
import {
  FaClock,
  FaEye,
  FaFileInvoice,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { InvoiceTable } from "../Table/InvoiceTable";
import { signOut, useSession } from "next-auth/react";
import Api from "@/lib/Api";
import { setInvoice } from "@/redux/slice/invoiceSlice";
import toast from "react-hot-toast";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { TableSkeleton } from "@/Components/ui/skeleton-loaders";
import { Skeleton } from "@/Components/ui/skeleton";

export default function DashboardContent() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const invoiceData = useSelector(
    (state: RootState) => state.invoiceData.invoiceData
  );

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardStats, setDashboardStats] = useState({
    totalInvoices: 0,
    thisMonthInvoices: 0,
    todayInvoices: 0,
    sentToAccountant: 0,
    sentToAccountantThisMonth: 0,
    errorsDetected: 0,
    nextScheduledScan: "17:30",
  });
  const [errorsDetected, setErrorsDetected] = useState(0);

  const { data } = useSession();
  const dispatch = useDispatch();
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = DashboardTranslations[currentLanguage];
  const modalT = ModalTranslations[currentLanguage];
  const invoice = InvoicePLaceholderTranslations[currentLanguage];
  const router = useRouter();
  const { currentSubscription: subscription } = useSubscription();
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch both dashboard stats and invoice data on component mount
  useEffect(() => {
    fetchDashboardData(currentPage);
  }, [currentPage, debouncedSearchTerm]);

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
    getErrorsDetected();
  }, []);

  const getErrorsDetected = async () => {
    try {
      const response = await Api.getSentToAccountantCountAndErrorsDetected();
      console.log({ response: response.data });
      if (response.data.success) {
        setErrorsDetected(response.data.errorsDetected);
      }
    } catch (error) {
      console.error("Error fetching errors detected:", error);
    }
  };

  const isUsageLimitReached =
    subscription?.usage &&
    subscription.usage >= (subscription.plan?.maxInvoicesPerMonth || 0);

  const fetchDashboardData = async (page: number = 1) => {
    try {
      // Fetch dashboard stats and invoices in parallel
      const [statsResponse, invoicesResponse] = await Promise.all([
        Api.getDashboardStats(),
        Api.getInvoices(page, 20, debouncedSearchTerm),
      ]);

      // Update dashboard stats
      if (statsResponse.data.success && statsResponse.data.data) {
        setDashboardStats(statsResponse.data.data);
      }
      setStatsLoading(false);

      // Update invoices
      if (invoicesResponse.data.invoices) {
        dispatch(
          setInvoice({
            success: true,
            data: invoicesResponse.data.invoices,
            total: invoicesResponse.data.pagination.total,
            page: invoicesResponse.data.pagination.page,
            limit: invoicesResponse.data.pagination.limit,
            totalPages: invoicesResponse.data.pagination.totalPages,
          })
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
      signOut({ callbackUrl: "/login" });
      setStatsLoading(false);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (invoiceData.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < (invoiceData.totalPages || 1)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* No Active Subscription Alert */}
      {/* {!subscription && (
        <div className="mb-4">
          <Alert variant="destructive">
            <FaExclamationTriangle />
            <AlertTitle>No Active Subscription</AlertTitle>
            <AlertDescription>
              You don't have any active subscription. Please subscribe to a plan
              to access all features.
            </AlertDescription>
          </Alert>
        </div>
      )} */}

      {/* Usage Limit Reached Alert */}
      {!!isUsageLimitReached && (
        <div className="mb-4">
          <Alert variant="destructive">
            <FaExclamationTriangle />
            <AlertTitle>Usage Limit Reached</AlertTitle>
            <AlertDescription>
              You have reached your usage limit. Please upgrade to continue.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl mb-2">
          {t.welcomeBack}, <span className="text-[#155dfc]">{data?.user?.name}!</span>
        </h1>
        <p className="text-neutral-600">{t.subTitleDashboard}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg border-2 transition-all hover:shadow-md" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
          <div className="flex justify-between items-start mb-4">
            <FaFileInvoice className="text-2xl" style={{ color: 'var(--card-accent)' }} />
            <span className="text-sm px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--card-accent)' }}>
              +{dashboardStats.todayInvoices} {t.today}
            </span>
          </div>
          <h3 className="text-sm text-neutral-600 mb-1">
            {t.totalInvoicesThisMonth}
          </h3>
          {statsLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-2xl font-semibold" style={{ color: 'var(--card-accent)' }}>{dashboardStats.thisMonthInvoices}</p>
          )}
        </div>

        <div className="p-6 rounded-lg border-2 transition-all hover:shadow-md" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
          <div className="flex justify-between items-start mb-4">
            <FaTriangleExclamation className="text-2xl" style={{ color: 'var(--card-accent)' }} />
            <span className="text-sm px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--card-accent)' }}>
              {errorsDetected} total
            </span>
          </div>
          <h3 className="text-sm text-neutral-600 mb-1">{t.errorsDetected}</h3>
          {statsLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-2xl font-semibold" style={{ color: 'var(--card-accent)' }}>{errorsDetected}</p>
          )}
        </div>

        <div className="p-6 rounded-lg border-2 transition-all hover:shadow-md" style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}>
          <div className="flex justify-between items-start mb-4">
            <FaClock className="text-2xl" style={{ color: 'var(--card-accent)' }} />
            <span className="text-sm px-2 py-1 rounded text-white" style={{ backgroundColor: 'var(--card-accent)' }}>
              {t.Today}
            </span>
          </div>
          <h3 className="text-sm text-neutral-600 mb-1">
            {t.nextScheduledScan}
          </h3>
          {statsLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-2xl font-semibold" style={{ color: 'var(--card-accent)' }}>{dashboardStats.nextScheduledScan}</p>
          )}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-lg transition-all hover:shadow-md" style={{ backgroundColor: 'var(--card-bg-light)' }}>
        <div className="p-4 border-b-2 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center" style={{ borderColor: 'var(--card-border-light)' }}>
          <h2 className="text-lg font-medium" style={{ color: 'var(--card-accent)' }}>{t.recentInvoices}</h2>
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-3" style={{ color: 'var(--card-accent)' }} />
            <input
              type="text"
              placeholder={`${t.searchInvoices}...`}
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{ 
                borderColor: 'var(--card-border-light)',
                backgroundColor: 'white',
                '--tw-ring-color': 'var(--card-accent)'
              } as React.CSSProperties}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8">
            <TableSkeleton rows={5} />
          </div>
        ) : (invoiceData.data || []).length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--card-accent)' }}>
            <FaFileInvoice className="mx-auto mb-2 text-2xl" style={{ color: 'var(--card-accent)' }} />
            <p>{invoice.noInvoicesFound}</p>
            <p className="text-sm">
              {searchTerm
                ? invoice.tryAdjustingSearch
                : invoice.invoicesWillAppear}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <InvoiceTable filteredInvoice={invoiceData.data as any || []} t={t} />
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t-2 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center" style={{ borderColor: 'var(--card-border-light)' }}>
          <div className="text-sm" style={{ color: 'var(--card-accent)' }}>
            {loading
              ? modalT.loading
              : searchTerm.trim()
              ? `${t.Showing} ${(invoiceData.data || []).length} filtered ${
                  t.entries
                } of ${invoiceData.total || 0} total`
              : `${t.Showing} ${Math.min(
                  (currentPage - 1) * 20 + 1,
                  invoiceData.total || 0
                )}–${Math.min(currentPage * 20, invoiceData.total || 0)} of ${
                  invoiceData.total || 0
                } ${t.entries}`}
          </div>
          {!searchTerm.trim() && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
                className="px-3 py-2 border-2 rounded-lg hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ 
                  borderColor: currentPage === 1 ? '#e5e7eb' : 'var(--card-accent)',
                  color: currentPage === 1 ? '#9ca3af' : 'var(--card-accent)',
                  backgroundColor: 'white'
                }}
              >
                {t.previous}
              </button>

              {/* Page numbers */}
              {Array.from(
                { length: Math.min(5, invoiceData.totalPages || 1) },
                (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const pageNumber = startPage + i;
                  if (pageNumber > (invoiceData.totalPages || 1)) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
                }
              )}

              <button
                onClick={handleNextPage}
                disabled={
                  currentPage === (invoiceData.totalPages || 1) || loading
                }
                className="px-3 py-2 border-2 rounded-lg hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ 
                  borderColor: currentPage === (invoiceData.totalPages || 1) ? '#e5e7eb' : 'var(--card-accent)',
                  color: currentPage === (invoiceData.totalPages || 1) ? '#9ca3af' : 'var(--card-accent)',
                  backgroundColor: 'white'
                }}
              >
                {t.next}
              </button>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
