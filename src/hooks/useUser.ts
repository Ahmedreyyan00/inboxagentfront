import { IUser } from "@/types/user";
import { Session } from "next-auth";
import { UpdateSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export interface ISessionData {
  user: {
    accessToken: string;
    me: IUser;
    isAdmin?: boolean;
  };
}

export interface IExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    twoFactorEnabled?: boolean;
    is2FAVerified?: boolean;
    isAdmin?: boolean;
  };
  accessToken?: string;
  requires2FA?: boolean;
}

const useUser = () => {
  const session = useSession() as unknown as IExtendedSession;
  const user = session.data?.user;
  const router = useRouter();

  const refresh = (user: IUser) => {
    session.update({
      ...user,
    });
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return { user, refresh, status: session.status };
};
export default useUser;
