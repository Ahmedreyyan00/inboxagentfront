import React from "react";
import { FaBolt, FaClock, FaShieldAlt } from "react-icons/fa";

const ResetPasswordEmail = () => {
  return (
    <main
      id="reset-password-email"
      className="min-h-[800px] bg-neutral-50 py-8 px-4"
    >
      <div className="max-w-xl mx-auto">
        {/* Email Preview Container */}
        <div
          id="email-preview"
          className="bg-white p-8 rounded-lg shadow-lg border border-neutral-200"
        >
          {/* Email Header */}
          <div className="flex items-center gap-2 mb-8 border-b border-neutral-200 pb-6">
            <FaBolt className="text-neutral-800 text-2xl" />
            <span className="text-2xl">Smartle</span>
          </div>

          {/* Email Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-xl mb-2">Hello,</h1>
              <p className="text-neutral-600">
                We've received a request to reset your password for your Smartle
                account.
              </p>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg text-center">
              <p className="text-neutral-600 mb-4">
                To reset your password, click the button below:
              </p>
              <button className="bg-[#1F2937]  cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-neutral-700 transition-colors">
                Reset Your Password
              </button>
            </div>

            <div className="space-y-4 text-sm text-neutral-600">
              <p className="flex items-center gap-2">
                <FaClock />
                This link will expire in 30 minutes for security reasons.
              </p>
              <p className="flex items-center gap-2">
                <FaShieldAlt />
                If you didn't request this password reset, please ignore this
                email.
              </p>
            </div>

            {/* Email Footer */}
            <div className="border-t border-neutral-200 mt-8 pt-6 text-sm text-neutral-500">
              <div className="space-y-2">
                <p>Need help? Contact our support team</p>
                <div className="flex gap-4">
                  <span className="underline hover:text-neutral-800 cursor-pointer">
                    Terms of Service
                  </span>
                  <span className="underline hover:text-neutral-800 cursor-pointer">
                    Privacy Policy
                  </span>
                </div>
                <p>© 2025 Smartle. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordEmail;
