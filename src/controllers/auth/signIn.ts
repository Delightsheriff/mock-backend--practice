import { Request, Response } from "express";
import User from "../../models/userModel";
import { Provider } from "../../common/constants";

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      statusText: "fail",
      message: "Please provide email and password",
    });
  }

  try {
    const user = await User.findOne({ email, provider: Provider.Local }).select(
      "+password +isEmailVerified +refreshToken",
    );

    if (!user) {
      return res.status(401).json({
        statusText: "fail",
        message: "Invalid email or password",
      });
    }

    // const isValidPassword = await user.comparePassword(password);
  } catch (error) {}
};
