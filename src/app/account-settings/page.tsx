'use client'

import AccountSettings from "@/Components/AccountSettings/page";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { RootState } from "@/redux/store";
import { SideBarTransalations } from "@/transalations/CommonTransaltion";
import { useSelector } from "react-redux";
export default function AccountSettingsPage() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const t = SideBarTransalations[language as "en" | "fr" | "nl"];
  return (
    <div className="h-full">
        <AccountSettings />
    </div>
  );
}
