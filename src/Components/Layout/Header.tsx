import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationModal from "../Modals/NotificationModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleSidebar } from "@/redux/slice/sidebarSlice";

export default function Header({ title }: { title: string }) {
  const { data } = useSession();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  const { data: session } = useSession();
  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 h-16 z-50 border-b-2"
        style={{
          backgroundColor: "var(--card-bg-light)",
          borderColor: "var(--card-border-light)",
        }}
      >
        <div className="flex items-center justify-between px-2 sm:px-6 h-full">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            {/* Sidebar Toggle Button - Only show on medium and small screens */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 transition-colors hover:shadow-sm rounded-lg"
              style={{ color: "var(--card-accent)" }}
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-lg" />
            </button>
            <div className="shrink-0">
              {/* <img
                src="/logo.svg"
                alt="Logo"
                width={100}
                height={100}
                className="w-16 sm:w-24 h-auto"
              /> */}
            </div>
            <div
              className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none"
              style={{ color: "var(--card-accent)" }}
            >
              {title}
            </div>
          </div>

          {/* Admin Alert - Integrated in header */}
          {session?.user?.isAdmin && (
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border-2"
              style={{
                backgroundColor: "var(--card-bg-medium)",
                borderColor: "var(--card-border-light)",
              }}
            >
              <FaShieldAlt
                className="text-sm"
                style={{ color: "var(--card-accent)" }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--card-accent)" }}
              >
                Admin Account
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 transition-colors hover:shadow-sm rounded-lg"
                style={{ color: "var(--card-accent)" }}
              >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </button>
            </div>

            <Image
              src={
                (data && data.user?.image) || "/smartleS.svg"
                // "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              }
              alt="avatar"
              width={28}
              height={28}
              className="rounded-full"
            />
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        isLoading={isLoading}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onRefresh={refreshNotifications}
      />
    </>
  );
}
