"use client";

import {
  FaUsers,
  FaUserCheck,
  FaCheckCircle,
  FaServer,
  FaUserPlus,
  FaExclamationTriangle,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AdminTranslations } from "@/transalations/AdminTransaltion";
import { Activity, StatCard } from "@/Utils/Card";
import UserGrowthChart from "./UserGrowthChart";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { useEffect, useState } from "react";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { DashboardPageSkeleton } from "@/Components/ui/skeleton-loaders";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  parseSuccessRate: string;
  systemUptime: string;
  newUsersThisMonth: number;
}

interface UserGrowthData {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

interface RecentActivity {
  users: Array<{
    fullName: string;
    email: string;
    createdAt: string;
  }>;
  invoices: Array<{
    supplierName: string;
    amount: string;
    status: string;
    createdAt: string;
    user: {
      fullName: string;
      email: string;
    };
  }>;
}

export default function AdminDashboard() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = AdminTranslations[currentLanguage];

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await Api.getAdminStats();
      const { stats: adminStats, userGrowthData, recentActivity } = response.data;
      
      setStats(adminStats);
      setUserGrowthData(userGrowthData);
      setRecentActivity(recentActivity);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      toast.error("Failed to load admin statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <main id="main-content" className="flex-1 p-8">
      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t.totalUsers}
            value={stats?.totalUsers?.toString() || "0"}
            icon={<FaUsers />}
            sub={` +${stats?.newUsersThisMonth || 0} ${t.fromLastMonth}`}
          />
          <StatCard
            title={t.activeUsers}
            value={stats?.activeUsers?.toString() || "0"}
            icon={<FaUserCheck />}
            sub={t.last7Days}
          />
          <StatCard
            title={t.parseSuccess}
            value={stats?.parseSuccessRate || "0%"}
            icon={<FaCheckCircle />}
            sub={t.last24Hours}
          />
          <StatCard
            title={t.systemUptime}
            value={stats?.systemUptime || "0%"}
            icon={<FaServer />}
            sub={t.last30Days}
          />
        </div>

        {/* Charts Grid */}
        <div className="gap-4">
          <UserGrowthChart 
            title={t.userGrowth} 
            data={userGrowthData}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <h3 className="text-lg font-medium mb-4">{t.recentActivity}</h3>
          <div className="space-y-4">
            {recentActivity?.users?.slice(0, 3).map((user, index) => (
              <Activity
                key={index}
                icon={<FaUserPlus />}
                text={`${t.newUserRegistered}: ${user.fullName} (${user.email})`}
                time={new Date(user.createdAt).toLocaleDateString()}
              />
            ))}
            {recentActivity?.invoices?.slice(0, 3).map((invoice, index) => (
              <Activity
                key={index}
                icon={<FaChartLine />}
                text={`Invoice processed: ${invoice.supplierName} - ${invoice.amount} (${invoice.user.fullName})`}
                time={new Date(invoice.createdAt).toLocaleDateString()}
              />
            ))}
            {(!recentActivity?.users?.length && !recentActivity?.invoices?.length) && (
              <div className="text-neutral-500 text-center py-4">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
