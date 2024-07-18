import nodemailer from "nodemailer";
import { generateEmailVerificationToken } from "./email";
import User from "../../models/userModel";
import { ENVIRONMENT } from "../config/environment";
import { Schema } from "mongoose";
// import { Types } from "mongoose";

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: ENVIRONMENT.EMAIL.USER,
    pass: ENVIRONMENT.EMAIL.PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

interface SendVerificationEmailParams {
  user: {
    _id: Schema.Types.ObjectId;
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
    emailVerificationExpiresAt: expiresAt,
  });

  // const verificationUrl = `${origin}/api/v1/auth/verify-email?token=${token}`;
  const verificationUrl = `${origin}/api/v1/auth/verify-email?token=${token}&email=${encodeURIComponent(
    user.email,
  )}`;

  const mailOptions = {
    from: `House Finder ${ENVIRONMENT.EMAIL.USER}`,
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <h1>Email Verification</h1>
      <p>Hi ${user.firstName},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" 
      _target="blank"
      >Verify Email</a>
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
