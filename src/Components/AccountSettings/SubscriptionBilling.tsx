import React, { useState, useEffect } from "react";
import { FaCircleCheck, FaSpinner } from "react-icons/fa6";
import { FaRegCreditCard, FaRegFilePdf, FaDownload, FaFileInvoice } from "react-icons/fa6";
import Api from "@/lib/Api";
import { IInvoice } from "@/types/invoice";
import toast from "react-hot-toast";
import { InvoicePLaceholderTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatAmount } from "@/Utils/formatAmount";

interface SubscriptionBillingProps {
  showBillingUpdateConfirmation: boolean;
  showPlanUpdateConfirmation: boolean;
  setShowPlanUpdateConfirmation: (show: boolean) => void;
  t: any;
}

export default function SubscriptionBilling({
  showBillingUpdateConfirmation,
  showPlanUpdateConfirmation,
  setShowPlanUpdateConfirmation,
  t,
}: SubscriptionBillingProps) {

   const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const invoice = InvoicePLaceholderTranslations[currentLanguage];
  
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await Api.getInvoices(1, 5); // Only get first 5 invoices for billing display
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoicePDF = async (invoiceId: string) => {
    try {
      setDownloadingId(invoiceId);
      const response = await Api.downloadInvoicePDF(invoiceId);
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `invoice-${invoiceId}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadAllInvoicesPDF = async () => {
    try {
      setDownloadingAll(true);
      const response = await Api.downloadAllInvoicesPDF();
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `invoices-bulk-${Date.now()}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('All invoices downloaded successfully');
    } catch (error) {
      console.error('Error downloading all invoices:', error);
      toast.error('Failed to download invoices');
    } finally {
      setDownloadingAll(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <section
      id="subscription-billing"
      className="bg-white rounded-lg border border-neutral-200 p-6 mb-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">{t.planAndBilling}</h2>
        <button className="px-3 py-1.5 border border-[var(--brand-color)] rounded-lg text-[var(--brand-color)] hover:bg-[var(--brand-color-light)] flex items-center gap-2 transition-colors">
          <FaRegCreditCard />
          {t.managePlan}
        </button>
      </div>
      <div className="mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{t.currentPlan}:</span>
            <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-sm">
              Pro
            </span>
            <span className="px-2 py-0.5 rounded bg-[var(--brand-color)] text-white text-xs ml-2">
              Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-600 text-sm">{t.nextRenewal}:</span>
            <span className="text-neutral-800 text-sm">2025-06-10</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="block text-sm mb-1">{t.billingCard}</label>
          <div className="flex items-center gap-4">
            <span className="text-lg tracking-widest">•••• 7521</span>
            <span className="text-neutral-600 text-sm">Exp 08/27</span>
            <button className="px-3 py-1 border border-[var(--brand-color)] rounded-lg text-[var(--brand-color)] hover:bg-[var(--brand-color-light)] transition-colors">
              {t.updatePaymentMethod}
            </button>
            <button className="px-3 py-1 border border-[var(--brand-color)] rounded-lg text-[var(--brand-color)] hover:bg-[var(--brand-color-light)] transition-colors">
              {t.addNewCard}
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-[var(--brand-color)] text-white rounded-lg hover:bg-[var(--brand-color-hover)] transition-colors"
          onClick={() => setShowPlanUpdateConfirmation(true)}
        >
          {t.upgardeDowngradePlan}
        </button>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FaFileInvoice />
          <span>{t.Invoices}</span>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <FaSpinner className="animate-spin mr-2" />
            <span>{invoice.loaderLoadingInvoices}</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-neutral-600">
            <FaFileInvoice className="mx-auto mb-2 text-2xl" />
            <p>{invoice.noInvoicesFound}</p>
            <p className="text-sm">{invoice.invoicesWillAppear}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-700 border-b border-neutral-200">
                    <th className="py-2 pr-6">{t.Date}</th>
                    <th className="py-2 pr-6">{t.Invoice} #</th>
                    <th className="py-2 pr-6">{t.Amount}</th>
                    <th className="py-2 pr-6">{t.Download}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice._id} className="border-b border-neutral-100">
                      <td className="py-2 pr-6">{formatDate(invoice.invoiceDate)}</td>
                      <td className="py-2 pr-6 truncate max-w-32" title={invoice.subject}>
                        {invoice.subject || 'N/A'}
                      </td>
                      <td className="py-2 pr-6 text-right">{formatAmount(invoice.amount, invoice.currency)}</td>
                      <td className="py-2 pr-6">
                        <button 
                          onClick={() => downloadInvoicePDF(invoice._id)}
                          disabled={downloadingId === invoice._id}
                          className="px-2 py-1 border border-[var(--brand-color)] rounded text-xs text-[var(--brand-color)] flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--brand-color-light)] transition-colors"
                        >
                          {downloadingId === invoice._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaRegFilePdf />
                          )}
                          {downloadingId === invoice._id ? 'Downloading...' : t.Download}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center">
              {invoices.length > 5 && (
                <p className="text-xs text-neutral-600">
                  Showing 5 of {invoices.length} invoices
                </p>
              )}
              <button 
                onClick={downloadAllInvoicesPDF}
                disabled={downloadingAll || invoices.length === 0}
                className="px-3 py-1.5 border border-[var(--brand-color)] rounded-lg text-[var(--brand-color)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--brand-color-light)] transition-colors ml-auto"
              >
                {downloadingAll ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaDownload />
                )}
                {downloadingAll ? 'Downloading...' : t.DownloadAll}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm text-neutral-700">
        {showBillingUpdateConfirmation && (
          <span className="flex items-center">
            <FaCircleCheck className="mr-2" />
            {invoice.paymentMethodUpdated}
          </span>
        )}
        {showPlanUpdateConfirmation && (
          <span className="flex items-center">
            <FaCircleCheck className="mr-2" />
           {invoice.planChangedSuccessfully}
          </span>
        )}
      </div>
    </section>
  );
} 