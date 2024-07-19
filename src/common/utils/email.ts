/**
 * @file email.ts
 * @description Provides utilities for generating, expiring, and verifying email tokens.
 */

import jwt from "jsonwebtoken";
import { ENVIRONMENT } from "../config/environment";

interface ITokenData {
  id: string;
}

/**
 * Generates a JWT token for email verification.
 *
 * @param userId - The user's ID to be encoded in the token
 * @param expiresIn - Token expiration time (default: '24h')
 * @returns An object containing the token and its expiration date
 */
export const generateEmailVerificationToken = (
  userId: string,
  expiresIn: string = "24h",
) => {
  const token = jwt.sign({ id: userId }, ENVIRONMENT.JWT.ACCESS_KEY, {
    expiresIn,
  });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  return { token, expiresAt };
};

/**
 * Verifies an email verification token.
 *
 * @param token - The token to verify
 * @returns The decoded token data if valid, null otherwise
 */
export const verifyEmailToken = (token: string): ITokenData | null => {
  try {
    const decoded = jwt.verify(token, ENVIRONMENT.JWT.ACCESS_KEY) as ITokenData;
    return decoded;
  } catch (error) {
    console.error("Error verifying email token:", error);
    return null;
  }
};

/**
 * Checks if a token has expired.
 *
 * @param expirationDate - The expiration date of the token
 * @returns True if the token has expired, false otherwise
 */
export const isTokenExpired = (expirationDate: Date): boolean => {
  return expirationDate < new Date();
};
