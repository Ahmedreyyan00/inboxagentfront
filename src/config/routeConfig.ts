export interface RouteConfig {
  path: string;
  showSidebar: boolean;
  showHeader: boolean;
  title?: string;
}

export const routeConfigs: RouteConfig[] = [
  // Routes with sidebar and header
  { path: "/dashboard", showSidebar: true, showHeader: true, title: "Dashboard" },
  { path: "/email-integration", showSidebar: true, showHeader: true, title: "Email Integration" },
  { path: "/invoice-history", showSidebar: true, showHeader: true, title: "Invoice History" },
  { path: "/scans", showSidebar: true, showHeader: true, title: "Invoice History" },
  { path: "/automation-settings", showSidebar: true, showHeader: true, title: "Automation Settings" },
  { path: "/account-settings", showSidebar: true, showHeader: true, title: "Account Settings" },
  { path: "/subscriptions", showSidebar: true, showHeader: true, title: "Subscription" },
  { path: "/help-center", showSidebar: true, showHeader: true, title: "Help Center" },
  
  // Admin routes with sidebar and header
  { path: "/admin", showSidebar: true, showHeader: true, title: "Admin Dashboard" },
  { path: "/admin/user-insights", showSidebar: true, showHeader: true, title: "User Insights" },
  { path: "/admin/system-health", showSidebar: true, showHeader: true, title: "System Health" },
  { path: "/admin/settings", showSidebar: true, showHeader: true, title: "Admin Settings" },
  
  // Routes without sidebar (landing pages, auth pages, etc.)
  { path: "/", showSidebar: false, showHeader: false },
  { path: "/landing", showSidebar: false, showHeader: false },
  { path: "/login", showSidebar: false, showHeader: false },
  { path: "/signup", showSidebar: false, showHeader: false },
  { path: "/forgot-password", showSidebar: false, showHeader: false },
  { path: "/reset-password", showSidebar: false, showHeader: false },
  { path: "/verify-otp", showSidebar: false, showHeader: false },
  { path: "/2fa", showSidebar: false, showHeader: false },
  
  // Legal pages (public)
  { path: "/privacy", showSidebar: false, showHeader: false },
  { path: "/terms", showSidebar: false, showHeader: false },
  { path: "/gdpr", showSidebar: false, showHeader: false },
];

export function getRouteConfig(pathname: string): RouteConfig {
  // Find exact match first
  const exactMatch = routeConfigs.find(config => config.path === pathname);
  if (exactMatch) return exactMatch;
  
  // Find partial match for nested routes
  const partialMatch = routeConfigs.find(config => 
    pathname.startsWith(config.path + '/') || pathname.startsWith(config.path)
  );
  if (partialMatch) return partialMatch;
  
  // Default configuration for unknown routes
  return {
    path: pathname,
    showSidebar: false,
    showHeader: false,
  };
}
