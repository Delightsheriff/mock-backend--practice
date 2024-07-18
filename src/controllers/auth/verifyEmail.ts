import { Request, Response } from "express";
import User from "../../models/userModel";
import { verifyEmailToken } from "../../common/utils/email";

export const verifyEmail = async (req: Request, res: Response) => {
  const { token, email } = req.query;
  console.log(`Token: ${token}, Email: ${email}`);

  if (
    !token ||
    typeof token !== "string" ||
    !email ||
    typeof email !== "string"
  ) {
    console.log("Token or email is missing or not a string");
    return res.status(400).json({
      statusText: "fail",
      message: "Both token and email are required",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email })
      .select("+emailVerificationToken +emailVerificationExpiresAt")
      .exec();

    if (!user) {
      console.log("User not found");
      return res.status(400).json({
        statusText: "fail",
        message: "Invalid email or token",
      });
    }

    // Verify the token
    const isValid = await verifyEmailToken(token, user);

    if (!isValid) {
      console.log("new bug point");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    return res.status(200).json({
      statusText: "success",
      message:
        "Your email has been successfully verified. You can now access your account.",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ statusText: "error", message: "Failed to verify email" });
  }
};
