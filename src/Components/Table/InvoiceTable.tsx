import { formatDateHumanReadable } from "@/Utils/formatDate";
import { formatAmount } from "@/Utils/formatAmount";
import { FaEye } from "react-icons/fa6";
import { useState } from "react";
import InvoiceModal from "../Modals/InvoiceModal";
import { IInvoice } from "@/types/invoice";
import toast from "react-hot-toast";

export const InvoiceTable = ({
  filteredInvoice,
  t,
}: {
  filteredInvoice: IInvoice[];
  t: any;
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
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

  return (
    <>
      <table className="w-full min-w-[640px] sm:min-w-0">
        <thead className="text-left" style={{ backgroundColor: 'var(--card-bg-medium)' }}>
          <tr>
            <th className="p-4" style={{ color: 'var(--card-accent)' }}>{t.invoiceDate}</th>
            <th className="p-4" style={{ color: 'var(--card-accent)' }}>{t.supplierName}</th>
            <th className="p-4 text-right hidden sm:table-cell" style={{ color: 'var(--card-accent)' }}>{t.amount}</th>
            <th className="p-4 hidden sm:table-cell" style={{ color: 'var(--card-accent)' }}>{t.status}</th>
            <th className="p-4 text-right" style={{ color: 'var(--card-accent)' }}>{t.action}</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoice.map((invoice: any, index: any) => (
            <tr key={invoice._id || index} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--card-border-light)' }}>
              <td className="p-4 whitespace-nowrap" style={{ color: '#1e40af' }}>
                {formatDateHumanReadable(invoice.invoiceDate)}
              </td>
              <td className="p-4" style={{ color: '#1e40af' }}>{invoice.supplierName || 'N/A'}</td>
              <td className="p-4 text-right font-bold hidden sm:table-cell" style={{ color: '#1e40af' }}>
                {formatAmount(invoice.parsedAmount, invoice.currency)}
              </td>
              <td className="p-4 hidden sm:table-cell">
                <span className={`px-2 py-1 rounded text-sm ${
                  invoice.status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : invoice.status === 'Overdue' 
                    ? 'bg-red-100 text-red-800' 
                    : invoice.status === 'Partially Paid'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-neutral-100 text-neutral-800'
                }`}>
                  {invoice.status || 'Unpaid'}
                </span>
              </td>
              <td className="p-4 text-right">
                <button 
                  className="hover:opacity-80 cursor-pointer transition-opacity p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleViewInvoice(invoice)}
                  style={{ color: '#3b82f6' }}
                >
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Invoice Modal */}
      {isModalOpen && selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={handleCloseModal}
          downloadInvoicePDF={downloadInvoicePDF}
        />
      )}
    </>
  );
};
