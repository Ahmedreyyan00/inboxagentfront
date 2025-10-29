"use client";

import {
  FaBuilding,
  FaCalendar,
  FaXmark,
  FaDownload,
  FaRotate,
  FaEye,
  FaFileInvoice,
  FaEnvelope,
  FaClock,
  FaMoneyBillWave,
  FaReceipt,
  FaCircleInfo,
  FaSpinner,
} from "react-icons/fa6";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IInvoice } from "@/types/invoice";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { formatAmount } from "@/Utils/formatAmount";

interface InvoiceDetailModalProps {
  invoice: IInvoice;
  onClose: () => void;
  downloadInvoicePDF: (invoice: IInvoice) => void;
}

const InvoiceDetailModal = ({
  invoice,
  onClose,
  downloadInvoicePDF,
}: InvoiceDetailModalProps) => {
  const [downloading, setDownloading] = useState(false);
  const [resending, setResending] = useState(false);
  // Guard against undefined invoice
  if (!invoice) {
    return null;
  }

  const resendToAccountant = async (invoiceId: string) => {
    try {
      setResending(true);
      const { data } = await Api.resendToAccountant(invoiceId);
      toast.success("Email sent successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to send email");
      console.log(error);
    } finally {
      setResending(false);
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <FaCheckCircle className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div
      id="invoice-detail-modal"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-neutral-950/70 p-0 sm:p-4"
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] h-[90vh] sm:h-[44rem] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-8 pb-3 sm:pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-lg sm:text-xl">Invoice #{invoice._id.slice(-8)}</span>
              <span
                className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                  invoice.status
                )} flex items-center gap-1`}
              >
                {getStatusIcon(invoice.status)}
                {invoice.status || "Unpaid"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-neutral-600">
              <span className="flex items-center gap-2">
                <FaBuilding className="text-neutral-400" />
                {invoice.supplierName || "N/A"}
              </span>
              <span className="flex items-center gap-2">
                <FaCalendar className="text-neutral-400" />
                {formatDate(invoice.invoiceDate)}
              </span>
            </div>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
            aria-label="Close"
            onClick={onClose}
          >
            <FaXmark className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="space-y-8">
            {/* Invoice Summary */}
            <div>
              <div className="text-base sm:text-lg mb-4 font-semibold">Invoice Summary</div>
              <div className="border border-neutral-200 rounded-lg p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 items-start sm:items-center">
                    <span className="text-neutral-600">Subject:</span>
                    <span className="font-medium">
                      {invoice.subject || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 items-start sm:items-center">
                    <span className="text-neutral-600">Amount:</span>
                    <span className="font-bold text-base sm:text-xl">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <div className="text-base sm:text-lg mb-4 font-semibold">Invoice Details</div>
              <div className="border border-neutral-200 rounded-lg p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="sm:w-40 text-neutral-500">Invoice Date:</span>
                    <span>{formatDate(invoice.invoiceDate)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="sm:w-40 text-neutral-500">Due Date:</span>
                    <span>
                      {invoice.dueDate
                        ? formatDate(invoice.dueDate)
                        : formatDate(invoice.invoiceDate)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="sm:w-40 text-neutral-500">Total Amount:</span>
                    <span>
                      {formatAmount(invoice.amount, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="sm:w-40 text-neutral-500">Supplier:</span>
                    <span>{invoice.supplierName || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="sm:w-40 text-neutral-500">
                      Email Forwarded:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        invoice.emailSent
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {invoice.emailSent ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => downloadInvoicePDF(invoice)}
                disabled={downloading}
                className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center"
              >
                {downloading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaDownload />
                )}
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
              <button
                onClick={() => resendToAccountant(invoice._id)}
                className="flex items-center gap-2 px-5 sm:px-6 py-3 border border-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-50 min-w-[180px] justify-center"
              >
                {resending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaRotate />
                )}
                {resending ? "Resending..." : "Resend to Accountant"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 py-4 border-t border-neutral-200 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;
