"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AdminTranslations } from "@/transalations/AdminTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaSpinner,
  FaUserSlash,
  FaUserCheck,
  FaEye,
} from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import { AdminUserInsightsSkeleton } from "../ui/skeleton-loaders";

interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  isUserSuspended: boolean;
  invoiceCount: number;
  subscription: string;
  hasEmailConnection: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export default function UserInsightDashboard() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = AdminTranslations[currentLanguage];

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, debouncedSearchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await Api.getAdminUserInsights(
        pagination.currentPage,
        20,
        debouncedSearchTerm
      );
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load user insights");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleUserStatusToggle = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      setUpdatingUser(userId);
      await Api.updateUserStatus(userId, !currentStatus);
      toast.success(
        `User ${!currentStatus ? "suspended" : "activated"} successfully`
      );
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading && users.length === 0) {
    return <AdminUserInsightsSkeleton />
  }

  return (
    <main id="main-content" className="flex-1 p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Insights</h1>
            <p className="text-neutral-600">Manage and monitor user accounts</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Invoices</th>
                  <th className="px-4 py-3 text-left">Subscription</th>
                  <th className="px-4 py-3 text-left">Email Connected</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-neutral-200 hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium">{user?.fullName || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{user?.email || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-neutral-100 rounded-full text-sm">
                        {user?.invoiceCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user?.subscription === "No Plan"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user?.subscription || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user?.hasEmailConnection
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user?.hasEmailConnection
                          ? "Connected"
                          : "Not Connected"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          user?.isUserSuspended
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user?.isUserSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUserStatusToggle(
                              user?._id,
                              user?.isUserSuspended
                            )
                          }
                          disabled={updatingUser === user?._id}
                          className={`p-2 rounded-lg ${
                            user?.isUserSuspended
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          } disabled:opacity-50`}
                          title={
                            user?.isUserSuspended
                              ? "Activate User"
                              : "Suspend User"
                          }
                        >
                          {updatingUser === user?._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : user?.isUserSuspended ? (
                            <FaUserCheck />
                          ) : (
                            <FaUserSlash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-neutral-200">
            <div className="text-neutral-600">
              Showing{" "}
              {Math.min(
                (pagination.currentPage - 1) * 20 + 1,
                pagination.totalUsers
              )}
              -{Math.min(pagination.currentPage * 20, pagination.totalUsers)} of{" "}
              {pagination.totalUsers} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.currentPage - 1))
                }
                disabled={pagination.currentPage === 1 || loading}
                className="px-3 py-1 border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const startPage = Math.max(1, pagination.currentPage - 2);
                  const pageNumber = startPage + i;
                  if (pageNumber > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={loading}
                      className={`px-3 py-1 rounded-lg ${
                        pageNumber === pagination.currentPage
                          ? "bg-neutral-800 text-white"
                          : "border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.currentPage + 1)
                  )
                }
                disabled={
                  pagination.currentPage === pagination.totalPages || loading
                }
                className="px-3 py-1 border border-neutral-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
