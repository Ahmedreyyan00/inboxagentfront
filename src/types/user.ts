export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  isAdmin: boolean;
} 