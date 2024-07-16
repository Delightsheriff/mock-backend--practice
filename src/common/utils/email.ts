/**
 * @file email.ts
 * @description Utility functions for handling email verification during user registration
 */

import crypto from "crypto";
import { promisify } from "util";

const randomBytes = promisify(crypto.randomBytes);

interface EmailVerificationToken {
  token: string;
  hashedToken: string;
  expiresAt: Date;
}

/**
 * Generates an email verification token
 * @returns {Promise<EmailVerificationToken>} A promise that resolves to an object containing the token, its hash, and expiration time
 */
export async function generateEmailVerificationToken(): Promise<EmailVerificationToken> {
  const buffer = await randomBytes(32);
  const token = buffer.toString("hex");
  const hashedToken = await hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  return {
    token,
    hashedToken,
    expiresAt,
  };
}

/**
 * Verifies the email verification token
 * @param {string} token - The verification token sent to the user's email
 * @param {string} hashedToken - The hashed token stored in the user document
 * @param {Date} expiresAt - The expiration time of the token
 * @returns {Promise<boolean>} A promise that resolves to true if the token is valid and not expired, false otherwise
 */
export async function verifyEmailToken(
  token: string,
  hashedToken: string,
  expiresAt: Date,
): Promise<boolean> {
  const computedHash = await hashToken(token);

  if (computedHash !== hashedToken) {
    return false;
  }

  if (new Date() > expiresAt) {
    return false;
  }

  return true;
}

/**
 * Hashes a token using SHA-256
 * @param {string} token - The token to hash
 * @returns {Promise<string>} A promise that resolves to the hashed token
 */
export async function hashToken(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(token, "salt", 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
}
