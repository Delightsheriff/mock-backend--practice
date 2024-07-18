import { Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  imageUrl: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiresAt: Date | null;
  provider: string;
  googleId: string;
  refreshToken: string;
  properties: Schema.Types.ObjectId[] | null;
}
