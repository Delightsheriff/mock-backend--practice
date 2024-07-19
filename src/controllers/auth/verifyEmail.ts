import { Request, Response } from "express";
import User from "../../models/userModel";
import { isTokenExpired, verifyEmailToken } from "../../common/utils/email";

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { token } = req.query;

  if (typeof token !== "string") {
    console.log("Invalid token type:", token);
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  try {
    const decoded = verifyEmailToken(token);
    console.log("Decoded token data:", decoded);

    if (!decoded) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.id);
    console.log("Found user:", user);

    if (!user) {
      res.status(400).json({ message: "Invalid token - user not found" });
      return;
    }

    console.log(
      "User's email verification token:",
      user.emailVerificationToken,
    );
    if (user.emailVerificationToken !== token) {
      res.status(400).json({ message: "Invalid token - token mismatch" });
      return;
    }

    if (
      !user.emailVerificationExpiresAt ||
      isTokenExpired(user.emailVerificationExpiresAt)
    ) {
      res.status(400).json({ message: "Token has expired" });
      return;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
