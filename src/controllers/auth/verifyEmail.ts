import { Request, Response } from "express";
import User from "../../models/userModel";
import { verifyEmailToken } from "../../common/utils/email";

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      statusText: "fail",
      message: "Token is required",
    });
  }
  try {
    const user = User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        statusText: "fail",
        message: "Invalid token or token expired",
      });
    }

    // Verify the token
    const isValid = await verifyEmailToken(
      token,
      user.emailVerificationToken,
      user.emailVerificationTokenExpiresAt,
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  } catch (error) {}
};
