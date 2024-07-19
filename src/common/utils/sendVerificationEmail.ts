/**
 * @file emailService.ts
 * @description Provides a service for sending verification emails.
 */

import { Request } from "express";
// import { generateEmailVerificationToken } from "./emailUtils";
import sendEmail from "./sendEmail";
import { generateEmailVerificationToken } from "./email";
import { IUserDocument } from "../../models/userModel";

/**
 * Sends a verification email to the user.
 *
 * @param user - The user object
 * @param req - The Express request object
 */
export const sendVerificationEmail = async (
  user: IUserDocument,
  origin: string,
): Promise<void> => {
  const { token, expiresAt } = generateEmailVerificationToken(
    user._id.toString(),
  );

  // Update user with new token and expiration
  await user.updateOne({
    emailVerificationToken: token,
    emailVerificationExpiresAt: expiresAt,
  });
  // console.log("user", user);
  await user.save();

  const verificationLink = `${origin}/api/v1/auth/verify-email?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <h1>Email Verification</h1>
      <p>Hi ${user.firstName},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};
