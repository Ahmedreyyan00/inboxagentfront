"use client";
import {
  FaCircleXmark,
  FaUserLock,
  FaServer,
  FaHeadset,
} from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import { MdWifiOff } from "react-icons/md";

const EmailFailureModal = ({ onClose,showImapEmailConnected }: { onClose: () => void, showImapEmailConnected: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <main
        id="email-integration-failure-main"
        className="flex-1 flex flex-col items-center justify-center min-h-[900px] px-4"
      >
        <div
          id="email-connection-failed-card"
          className="bg-white shadow-lg rounded-xl w-full max-w-lg p-10 flex flex-col items-center text-center border border-neutral-200 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-4 right-4 text-neutral-400 hover:text-neutral-700 transition"
          >
            <FaCircleXmark className="text-xl" />
          </button>

          <div id="email-connection-failed-title-block" className="mb-8 mt-4">
            <h1 className="text-3xl text-neutral-900 text-center">
              Connection Failed
            </h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-neutral-100 flex items-center justify-center w-16 h-16">
                <FaCircleXmark className="text-4xl text-[#1F2937]" />
              </div>
            </div>
            <h2 className="text-xl text-neutral-900 mb-2">
              We couldn’t connect to your email account.
            </h2>
            <p className="text-neutral-700 text-base mb-4">
              There was an issue connecting your email account. Please check
              your credentials and internet connection, then try again.
            </p>

            <div className="text-left mb-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <FaRegCircleXmark className="text-lg mt-0.5 text-neutral-500" />
                  <span className="text-neutral-800 text-sm">
                    Incorrect email or password
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MdWifiOff className="text-lg mt-0.5 text-neutral-500" />
                  <span className="text-neutral-800 text-sm">
                    Network connectivity issues
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaUserLock className="text-lg mt-0.5 text-neutral-500" />
                  <span className="text-neutral-800 text-sm">
                    Authorization denied or token expired
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaServer className="text-lg mt-0.5 text-neutral-500" />
                  <span className="text-neutral-800 text-sm">
                    IMAP server settings incorrect (if applicable)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full mt-2">
            <button onClick={showImapEmailConnected} className="flex-1 inline-flex bg-[#1F2937] items-center justify-center rounded-lg px-6 py-3 shadow text-white text-base transition">
              Try Again
            </button>
            <span className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 border border-neutral-300 bg-neutral-100 text-neutral-900 text-base transition hover:bg-neutral-200 cursor-pointer">
              <FaHeadset />
              Get Help
            </span>
          </div>

          <div className="mt-8">
            <span className="text-sm text-neutral-500 underline hover:text-neutral-900 transition cursor-pointer">
              Need help connecting your email? Visit our Help Center or FAQs.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailFailureModal;
