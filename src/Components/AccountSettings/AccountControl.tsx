import React, { useState } from "react";
import { FaCircleExclamation, FaSpinner } from "react-icons/fa6";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModalTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

interface AccountControlProps {
  t: any;
}

export default function AccountControl({ t }: AccountControlProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const modalT = ModalTranslations[currentLanguage];

  const handleExportPersonalData = async () => {
    try {
      setIsExporting(true);
      const response = await Api.exportPersonalData();
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `personal-data-export-${new Date().toISOString().slice(0, 10)}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Personal data exported successfully');
    } catch (error) {
      console.error('Error exporting personal data:', error);
      toast.error('Failed to export personal data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const response = await Api.deleteUserAccount();
      
      if (response.data.success) {
        toast.success('Account deleted successfully. You will be logged out.');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to delete account');
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <section
      id="account-control"
      className="rounded-lg border-2 p-6 mb-28 shadow-md"
      style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}
    >
      <h2 className="text-xl mb-4" style={{ color: 'var(--card-accent)' }}>{t.AccountControl}</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="mb-3 md:mb-0 flex items-center" style={{ color: 'var(--card-accent)' }}>
          <FaCircleExclamation className="mr-2" style={{ color: 'var(--card-accent)' }} />
          <span className="text-base">{t.thisActionIsIrreversible}</span>
        </div>
        <button 
          onClick={handleExportPersonalData}
          disabled={isExporting}
          className="px-4 py-2 border-2 rounded-lg transition text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-sm"
          style={{ 
            backgroundColor: 'white',
            borderColor: 'var(--card-border-light)',
            color: 'var(--card-accent)'
          }}
        >
          {isExporting ? <FaSpinner className="animate-spin" /> : null}
          {isExporting ? modalT.exporting : t.exportPersonalData}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div style={{ color: 'var(--card-accent)' }}>
          <div className="text-base mb-1">{t.deleteAccount}</div>
          <div className="text-sm" style={{ color: 'var(--card-accent)', opacity: 0.7 }}>
            {t.warningDeletingAccount}
          </div>
        </div>
        <button 
          onClick={confirmDeleteAccount}
          disabled={isDeleting}
          className="px-4 py-2 border-2 rounded-lg transition mt-4 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-sm"
          style={{ 
            backgroundColor: 'white',
            borderColor: 'var(--card-border-light)',
            color: 'var(--card-accent)'
          }}
        >
          {isDeleting ? <FaSpinner className="animate-spin" /> : null}
          {isDeleting ? modalT.deleting : t.deleteMyAccount}
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-lg shadow-xl border-2 p-6 max-w-md mx-4" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
            <div className="flex items-center mb-4">
              <FaCircleExclamation className="text-red-500 text-xl mr-3" />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--card-accent)' }}>
                {modalT.confirmDeleteAccount}
              </h3>
            </div>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--card-accent)' }}>
              {modalT.deleteAccountWarning}
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                style={{ 
                  borderColor: 'var(--card-border-light)',
                  color: 'var(--card-accent)',
                  backgroundColor: 'white'
                }}
              >
                {modalT.cancel}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? <FaSpinner className="animate-spin text-sm" /> : null}
                {isDeleting ? modalT.deleting : modalT.deleteAccountConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 