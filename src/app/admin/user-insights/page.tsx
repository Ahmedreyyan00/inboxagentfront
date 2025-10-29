"use client";

import UserInsightDashboard from "@/Components/Admin/UserInsightDashboard";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SideBarTransalations } from "@/transalations/CommonTransaltion";
import { isValidLanguageCode } from "@/Utils/languageUtils";

export default function UserInsightsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : 'en';
  const t = SideBarTransalations[currentLanguage];

  useEffect(() => {
    if (session?.user && !session.user.isAdmin) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="h-full text-base-content">
        <UserInsightDashboard />
    </div>
  );
}
