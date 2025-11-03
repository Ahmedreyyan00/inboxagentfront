"use client";

import {
  sidebarLinksTranslations,
  adminSidebarLinksTranslations,
} from "@/Mapper/SidebarMapper";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaRightFromBracket } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { SideBarTransalations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { setSidebarOpen } from "@/redux/slice/sidebarSlice";
import { useAuth } from "@/hooks/useAuth";
import { FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const sidebarLinks = sidebarLinksTranslations[currentLanguage];
  const adminLinks = adminSidebarLinksTranslations[currentLanguage];
  const t = SideBarTransalations[currentLanguage];
  const { data: session } = useSession();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      
      <aside className={`w-[300px] h-[calc(100vh-64px)] bg-slate-900 fixed left-0 top-16 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out overflow-hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:block`}>
                <nav className="p-3 flex flex-col h-full">
          {/* Close button for mobile - sticky at top */}
          <div className="flex justify-end lg:hidden mb-2 sticky top-0 bg-slate-900 pt-1 pb-2 z-10">
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto sidebar-scrollbar">
            <div className="flex flex-col gap-1 text-slate-200">
              {sidebarLinks.map(({ icon, label, href }) => (
                <Link key={href} href={href} onClick={() => dispatch(setSidebarOpen(false))}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                      pathname === href ? "bg-slate-800 text-white" : "hover:bg-slate-800"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </div>
                </Link>
              ))}

              {/* Admin Links - Only show for admin users */}
              {session?.user?.isAdmin && (
                <>
                  <div className="border-t border-slate-700 my-2"></div>
                  <div className="text-sm font-medium px-3 py-2 text-slate-400">Admin Section</div>
                  {adminLinks.map(({ icon, label, href }) => (
                    <Link key={href} href={href} onClick={() => dispatch(setSidebarOpen(false))}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                          pathname === href
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800"
                        }`}
                      >
                        {icon}
                        <span>{label}</span>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Logout button - fixed at bottom */}
          <div className="mt-2 pt-2 border-t border-slate-800">
            <div
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-200 hover:bg-slate-800`}
            >
              <FaRightFromBracket />
              <span>{t.logOut}</span>
            </div>
          </div>
        </nav>
    </aside>
    </>
  );
}
