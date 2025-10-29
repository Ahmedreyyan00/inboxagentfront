"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const allowedPaths = useMemo(
    () => [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-otp",
      "/favicon.ico",
      "/api/auth",
      "/_next",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/gdpr",
    ],
    []
  );

  const SessionGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();

    useEffect(() => {
      if (!allowedPaths.includes(pathname) && status === "unauthenticated") {
        router.replace("/login");
      }
    }, [pathname, status, router, allowedPaths]);

    // While loading, avoid showing protected content
    if (
      status === "loading" &&
      !allowedPaths.includes(pathname)
    ) {
      return null;
    }
    return <>{children}</>;
  };

  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SessionGuard>{children}</SessionGuard>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};
