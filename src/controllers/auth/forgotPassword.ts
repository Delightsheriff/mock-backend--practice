import { Request, Response } from "express";
import User from "../../models/userModel";
import sendEmail from "../../common/utils/sendEmail";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ statusText: "error", message: "User not found" });
      return;
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host",
    )}/api/v1/auth/reset-password/${resetToken}`;

    const message = `
      <h1>Forgot your password?</h1>
      <p>Click on the link below to reset your password:</p>
      <a href="${resetURL}" target="_blank">Reset Password</a>
      <p>If you didn't forget your password, please ignore this email!</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Your password reset link (valid for 1 hour)",
        html: message,
      });

      res.status(200).json({
        statusText: "success",
        message: "Password reset link sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        statusText: "error",
        message: "There was an error sending the email. Try again later!",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusText: "error",
      message: "An error occurred. Please try again later.",
    });
  }
};
