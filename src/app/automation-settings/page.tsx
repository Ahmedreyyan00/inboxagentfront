'use client'

import AutomationSettings from "@/Components/AutomationSettings/AutomationSettings";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { RootState } from "@/redux/store";
import { SideBarTransalations } from "@/transalations/CommonTransaltion";
import { useSelector } from "react-redux";

export default function AutomationSettingsPage() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const t = SideBarTransalations[language as "en" | "fr" | "nl"];
  return (
    <div className="h-full text-base-content">
      <div className="flex">
        <Sidebar />
        <AutomationSettings />
      </div>
    </div>
  );
}

