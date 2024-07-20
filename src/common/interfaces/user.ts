import { Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  imageUrl: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiresAt: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  passwordResetAttempts: number;
  passwordChangedAt: Date;
  provider: string;
  googleId: string;
  refreshToken: string;
  properties: Schema.Types.ObjectId[] | null;
}
