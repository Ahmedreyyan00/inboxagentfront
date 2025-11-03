"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AdminTranslations } from "@/transalations/AdminTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { FaSpinner, FaUsers, FaReceipt, FaCreditCard, FaCog } from "react-icons/fa";
import { AdminSettingsSkeleton } from "@/Components/ui/skeleton-loaders";

interface SystemStats {
  totalUsers: number;
  totalInvoices: number;
  totalSubscriptions: number;
}

interface SubscriptionStats {
  _id: string;
  count: number;
}

export default function SettingsDashboard() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = AdminTranslations[currentLanguage];

  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const response = await Api.getAdminSettings();
      setSystemStats(response.data.systemStats);
      setSubscriptionStats(response.data.subscriptionStats);
    } catch (error) {
      console.error("Failed to fetch admin settings:", error);
      toast.error("Failed to load admin settings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AdminSettingsSkeleton />;
  }

  return (
    <main id="main-content" className="flex-1 p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Settings</h1>
            <p className="text-neutral-600">System configuration and management</p>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Total Users</h3>
                <p className="text-2xl font-bold">{systemStats?.totalUsers || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">Registered accounts</p>
              </div>
              <FaUsers className="text-2xl text-neutral-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Total Invoices</h3>
                <p className="text-2xl font-bold">{systemStats?.totalInvoices || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">Processed invoices</p>
              </div>
              <FaReceipt className="text-2xl text-neutral-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Total Subscriptions</h3>
                <p className="text-2xl font-bold">{systemStats?.totalSubscriptions || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">Active subscriptions</p>
              </div>
              <FaCreditCard className="text-2xl text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionStats.map((stat) => (
              <div key={stat._id} className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium capitalize">{stat._id}</h3>
                    <p className="text-2xl font-bold">{stat.count}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    stat._id === 'active' ? 'bg-green-500' : 
                    stat._id === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
