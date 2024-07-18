import { Request, Response } from "express";
import User from "../../models/userModel";
import { hashPassword } from "../../common/utils/helpers";
import { Provider, Role } from "../../common/constants";
import { sendVerificationEmail } from "../../common/utils/sendEmail";

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

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      provider: Provider.Local,
      role,
    });

    // Send verification email
    const origin = `${req.protocol}://${req.get("host")}`;
    await sendVerificationEmail({ user, origin });

    res.status(201).json({
      statusText: "success",
      message:
        "User created successfully. Please check your email to verify your account.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred during signup. Please try again later.",
    });
  }
};
