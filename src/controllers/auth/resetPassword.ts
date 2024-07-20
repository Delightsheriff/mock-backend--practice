import { Request, Response } from "express";
import { verifyEmailToken } from "../../common/utils/email";
import User from "../../models/userModel";

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({
      statusText: "error",
      message: "Please provide both token and new password.",
    });
    return;
  }

  try {
    const decoded = verifyEmailToken(token);

    const user = await User.findOne({
      _id: decoded?.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        statusText: "error",
        message: "Password reset token is invalid or has expired",
      });
      return;
    }

    if (user.passwordResetAttempts >= 3) {
      res.status(400).json({
        statusText: "error",
        message: "Too many reset attempts. Please request a new reset link.",
      });
      return;
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordResetAttempts += 1;
    user.passwordChangedAt = new Date();

    await user.save();

    res.status(200).json({
      statusText: "success",
      message: "Your password has been reset successfully",
    });
  } catch (error) {}
};
