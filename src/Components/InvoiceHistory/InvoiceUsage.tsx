import { FaInfoCircle, FaFileInvoice } from "react-icons/fa";

const InvoiceUsage = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <div className="flex items-center mb-6">
        <h3 className="mr-2">Invoice Processing Usage</h3>
        <FaInfoCircle
          className="text-neutral-400 cursor-pointer"
          title="Your subscription includes invoice processing limits. Usage resets on the 1st of each month."
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl text-neutral-900">1,000</div>
          <div className="text-sm text-neutral-500">Plan Limit</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-neutral-600">450</div>
          <div className="text-sm text-neutral-500">Used</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-neutral-900">550</div>
          <div className="text-sm text-neutral-500">Remaining</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-neutral-600 mb-2">
          <span>Usage Progress</span>
          <span>45%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div className="bg-neutral-900 h-3 rounded-full" style={{ width: "45%" }}></div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
        <div className="flex items-center">
          <FaFileInvoice className="text-neutral-600 mr-2" />
          <span className="text-sm text-neutral-600">
            Monthly allowance resets in 12 days
          </span>
        </div>
        <button className="text-sm text-neutral-900 hover:underline">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default InvoiceUsage;
