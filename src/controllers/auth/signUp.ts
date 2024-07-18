import { Request, Response } from "express";
import User, { IUserDocument } from "../../models/userModel";
import { Provider, Role } from "../../common/constants";
import { sendVerificationEmail } from "../../common/utils/sendVerificationEmail";

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({
      statusText: "fail",
      message: "Please provide all required fields",
    });
  }

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({
      statusText: "fail",
      message: "Invalid role provided",
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        statusText: "fail",
        message: "User with this email already exists",
      });
    }

    const user: IUserDocument = await User.create({
      firstName,
      lastName,
      email,
      password,
      provider: Provider.Local,
      role,
    });

    // Send verification email
    const origin = `${req.protocol}://${req.get("host")}`;
    console.log("origin", origin);
    await sendVerificationEmail({
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
      origin,
    });

    res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred during signup. Please try again later.",
    });
  }
};
