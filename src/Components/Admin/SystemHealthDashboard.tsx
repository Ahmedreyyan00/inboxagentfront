"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AdminTranslations } from "@/transalations/AdminTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { FaSpinner, FaExclamationTriangle, FaCheckCircle, FaServer, FaChartLine } from "react-icons/fa";
import { AdminSystemHealthSkeleton } from "@/Components/ui/skeleton-loaders";

interface SystemMetrics {
  totalInvoices: number;
  invoicesLast24h: number;
  totalSyncs: number;
  syncsLast24h: number;
  failedSyncs: number;
  errorRate: string;
  activeSubscriptions: number;
  suspendedUsers: number;
}

interface RecentError {
  _id: string;
  status: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function SystemHealthDashboard() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = AdminTranslations[currentLanguage];

  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [recentErrors, setRecentErrors] = useState<RecentError[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await Api.getAdminSystemHealth();
      setMetrics(response.data.metrics);
      setRecentErrors(response.data.recentErrors);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      toast.error("Failed to load system health data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getHealthStatus = (errorRate: string) => {
    const rate = parseFloat(errorRate.replace('%', ''));
    if (rate < 1) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (rate < 5) return { status: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return <AdminSystemHealthSkeleton />;
  }

  return (
    <main id="main-content" className="flex-1 p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">System Health</h1>
            <p className="text-neutral-600">Monitor system performance and identify issues</p>
          </div>
          <button
            onClick={() => fetchSystemHealth(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg flex items-center gap-2 hover:bg-neutral-700 disabled:opacity-50"
          >
            {refreshing ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaChartLine />
            )}
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Total Invoices</h3>
                <p className="text-2xl font-bold">{metrics?.totalInvoices || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">
                  +{metrics?.invoicesLast24h || 0} in last 24h
                </p>
              </div>
              <FaServer className="text-2xl text-neutral-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Total Syncs</h3>
                <p className="text-2xl font-bold">{metrics?.totalSyncs || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">
                  +{metrics?.syncsLast24h || 0} in last 24h
                </p>
              </div>
              <FaChartLine className="text-2xl text-neutral-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Error Rate</h3>
                <p className="text-2xl font-bold">{metrics?.errorRate || "0%"}</p>
                <p className="text-sm text-neutral-600 mt-2">
                  {metrics?.failedSyncs || 0} failed syncs
                </p>
              </div>
              <div className={`p-2 rounded-full ${getHealthStatus(metrics?.errorRate || "0%").bg}`}>
                <FaExclamationTriangle className={`text-2xl ${getHealthStatus(metrics?.errorRate || "0%").color}`} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-neutral-600 mb-2">Active Subscriptions</h3>
                <p className="text-2xl font-bold">{metrics?.activeSubscriptions || 0}</p>
                <p className="text-sm text-neutral-600 mt-2">
                  {metrics?.suspendedUsers || 0} suspended users
                </p>
              </div>
              <FaCheckCircle className="text-2xl text-green-400" />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <div>
                <p className="font-medium">Email Processing</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <div>
                <p className="font-medium">API Services</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold">Recent Errors</h2>
            <p className="text-sm text-neutral-600">Failed sync operations in the last 7 days</p>
          </div>
          <div className="overflow-x-auto">
            {recentErrors.length > 0 ? (
              <table className="w-full">
                <thead className="border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Error Type</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentErrors.map((error) => (
                    <tr key={error._id} className="border-b border-neutral-200 hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{error.user.fullName}</p>
                          <p className="text-sm text-neutral-600">{error.user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          Sync Failed
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {new Date(error.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          Failed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-neutral-500">
                <FaCheckCircle className="mx-auto mb-2 text-2xl text-green-500" />
                <p>No recent errors found</p>
                <p className="text-sm">System is running smoothly</p>
              </div>
            )}
          </div>
        </div>

   
      </div>
    </main>
  );
}
