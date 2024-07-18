import { Request, Response } from "express";
import User from "../../models/userModel";
import { verifyEmailToken } from "../../common/utils/email";
import { stat } from "fs";

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      statusText: "fail",
      message: "Token is required",
    });
  }
  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        statusText: "fail",
        message: "Invalid token or token expired",
      });
    }

    // Verify the token
    const isValid = await verifyEmailToken(token, user);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ statusText: "error", message: "Failed to verify email" });
  }
};
