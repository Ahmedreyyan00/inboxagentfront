import { FaGoogle, FaQuestionCircle, FaUser, FaShieldAlt, FaUsers, FaChartLine, FaServer, FaCog } from "react-icons/fa";
import { FaHouse, FaReceipt, FaRobot } from "react-icons/fa6";

export const sidebarLinksTranslations = {
  en: [
    { icon: <FaHouse />, label: "Dashboard", href: "/dashboard" },
    { icon: <FaGoogle />, label: "Email Integration", href: "/email-integration" },
    { icon: <FaReceipt />, label: "Scans", href: "/scans" },
    // { icon: <FaRobot />, label: "Automation Settings", href: "/automation-settings" },
    // { icon: <FaUser />, label: "Account Settings", href: "/account-settings" },
    // { icon: <FaReceipt />, label: "Subscription", href: "/subscriptions" },
    // { icon: <FaQuestionCircle />, label: "Help Center", href: "/help-center" },
  ],
  fr: [
    { icon: <FaHouse />, label: "Tableau de bord", href: "/dashboard" },
    { icon: <FaGoogle />, label: "Intégration des e-mails", href: "/email-integration" },
    { icon: <FaReceipt />, label: "Scans", href: "/scans" },
    // { icon: <FaRobot />, label: "Paramètres d'automatisation", href: "/automation-settings" },
    // { icon: <FaReceipt />, label: "Abonnement", href: "/subscriptions" },
    // { icon: <FaUser />, label: "Paramètres du compte", href: "/account-settings" },
    // { icon: <FaQuestionCircle />, label: "Centre d'aide", href: "/help-center" },
  ],
  nl: [
    { icon: <FaHouse />, label: "Dashboard", href: "/dashboard" },
    { icon: <FaGoogle />, label: "E-mailintegratie", href: "/email-integration" },
    { icon: <FaReceipt />, label: "Scans", href: "/scans" },
    // { icon: <FaRobot />, label: "Automatiseringsinstellingen", href: "/automation-settings" },
    // { icon: <FaUser />, label: "Accountinstellingen", href: "/account-settings" },
    // { icon: <FaReceipt />, label: "Abonnement", href: "/subscriptions" },
    // { icon: <FaQuestionCircle />, label: "Helpcentrum", href: "/help-center" },
  ],
};

export const adminSidebarLinksTranslations = {
  en: [
    // { icon: <FaShieldAlt />, label: "Admin Dashboard", href: "/admin" },
    // { icon: <FaUsers />, label: "User Insights", href: "/admin/user-insights" },
    // { icon: <FaServer />, label: "System Health", href: "/admin/system-health" },
    // { icon: <FaCog />, label: "Admin Settings", href: "/admin/settings" },
  ],
  fr: [
    // { icon: <FaShieldAlt />, label: "Tableau de bord Admin", href: "/admin" },
    // { icon: <FaUsers />, label: "Aperçu des utilisateurs", href: "/admin/user-insights" },
    // { icon: <FaServer />, label: "Santé du système", href: "/admin/system-health" },
    // { icon: <FaCog />, label: "Paramètres Admin", href: "/admin/settings" },
  ],
  nl: [
    // { icon: <FaShieldAlt />, label: "Admin Dashboard", href: "/admin" },
    // { icon: <FaUsers />, label: "Gebruikersinzichten", href: "/admin/user-insights" },
    // { icon: <FaServer />, label: "Systeemgezondheid", href: "/admin/system-health" },
    // { icon: <FaCog />, label: "Admin Instellingen", href: "/admin/settings" },
  ],
};
