import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    accessToken?: string;
    twoFactorEnabled?: boolean;
    requires2FA?: boolean;
    is2FAVerified?: boolean;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      image?: string;
      id: string;
      email: string;
      name: string;
      twoFactorEnabled?: boolean;
      is2FAVerified?: boolean;
      isAdmin?: boolean;
    };
    accessToken?: string;
    requires2FA?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    twoFactorEnabled?: boolean;
    requires2FA?: boolean;
    is2FAVerified?: boolean;
    isAdmin?: boolean;
  }
} 