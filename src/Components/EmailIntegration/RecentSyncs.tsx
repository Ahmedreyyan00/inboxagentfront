import { IconType } from "react-icons";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ModalTranslations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

export default function RecentSyncsCard({
  Icon,
  timeAndDate,
  desc,
  btnText,
  syncId,
  onDownload,
  isDownloading
}: {
  Icon: IconType;
  timeAndDate: string;
  desc: string;
  btnText: string;
  syncId: string;
  onDownload: (syncId: string) => void;
  isDownloading: boolean;
}) {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const modalT = ModalTranslations[currentLanguage];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 border border-neutral-200 rounded-lg">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
        <Icon className="text-green-600 text-xl sm:text-2xl" />
        <div className="flex-1">
          <div className="text-sm sm:text-base">{timeAndDate}</div>
          <div className="text-xs sm:text-sm text-green-600 mt-0.5">{desc}</div>
        </div>
      </div>
      <button 
        onClick={() => onDownload(syncId)}
        disabled={isDownloading}
        className={`w-full sm:w-auto text-neutral-600 flex items-center justify-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg transition-colors ${
          isDownloading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-neutral-50 hover:border-neutral-300'
        }`}
      >
        {isDownloading ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaDownload />
        )}
        <span className="text-sm">
          {isDownloading ? modalT.downloading : btnText}
        </span>
      </button>
    </div>
  );
}
