import nodemailer from "nodemailer";
import { generateEmailVerificationToken } from "./email";
import User from "../../models/userModel";
import { ENVIRONMENT } from "../config/environment";
import { Types } from "mongoose";

// Configure the email transporter
const transporter = nodemailer.createTransport({
  // Replace these with your email service configuration
  host: "smtp.gmail.com",
  port: 587,
  secure: true, // Use TLS
  auth: {
    user: ENVIRONMENT.EMAIL.USER,
    pass: ENVIRONMENT.EMAIL.PASSWORD,
  },
});

interface SendVerificationEmailParams {
  user: {
    _id: Types.ObjectId;
    email: string;
    firstName: string;
  };
  origin: string;
}

export async function sendVerificationEmail({
  user,
  origin,
}: SendVerificationEmailParams): Promise<void> {
  const { token, hashedToken, expiresAt } =
    await generateEmailVerificationToken();

  // Save the hashed token and expiration to the user document
  await User.findByIdAndUpdate(user._id, {
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiresAt: expiresAt,
  });

  const verificationUrl = `${origin}/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Your App Name" <noreply@yourapp.com>',
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <h1>Email Verification</h1>
      <p>Hi ${user.firstName},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
