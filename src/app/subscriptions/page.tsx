"use client";
import SubscriptionTable from "@/Components/Subscription/SubscriptionTable";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { RootState } from "@/redux/store";
import { SideBarTransalations } from "@/transalations/CommonTransaltion";
import { useSelector } from "react-redux";

export default function SubscriptionPage() {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const t = SideBarTransalations[language as "en" | "fr" | "nl"];

  return (
    <div className="h-full text-base-content">
        <SubscriptionTable />
    </div>
  );
}
