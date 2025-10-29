"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getRouteConfig } from "@/config/routeConfig";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SideBarTransalations } from "@/transalations/CommonTransaltion";

interface DynamicLayoutWrapperProps {
  children: ReactNode;
}

export default function DynamicLayoutWrapper({ children }: DynamicLayoutWrapperProps) {
  const pathname = usePathname();
  const routeConfig = getRouteConfig(pathname);
  
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const t = SideBarTransalations[language as "en" | "fr" | "nl"];

  // Get the title from route config or translations
  const getTitle = () => {
    if (routeConfig.title) {
      // Map route titles to translation keys
      const titleMap: Record<string, keyof typeof t> = {
        "Dashboard": "dashboard",
        "Email Integration": "emailIntegration",
        "Invoice History": "invoiceHistory",
        "Automation Settings": "automationSettings",
        "Account Settings": "accountSettings",
        "Help Center": "helpCenter",
      };
      
      const translationKey = titleMap[routeConfig.title];
      return translationKey && t[translationKey] ? t[translationKey] : routeConfig.title;
    }
    return "";
  };

  return (
    <div className="h-full text-base-content">
      {routeConfig.showHeader && <Header title={getTitle()} />}
      {routeConfig.showSidebar && <Sidebar />}
      <div className={`${routeConfig.showHeader ? 'pt-16' : ''} transition-all duration-300 ease-in-out ${routeConfig.showSidebar ? 'ml-0 lg:ml-[300px]' : ''}`}>
        {children}
      </div>
    </div>
  );
}
