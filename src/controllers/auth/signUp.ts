/**
 * @file authController.ts
 * @description Contains authentication-related controller functions, including user signup.
 */

import { Request, Response } from "express";
import User, { IUserDocument } from "../../models/userModel";
import { Provider, Role } from "../../common/constants";
import { sendVerificationEmail } from "../../common/utils/sendVerificationEmail";
import mongoose from "mongoose";

/**
 * Handles user signup process.
 *
 * This function validates the input, checks for existing users,
 * creates a new user in the database, and returns appropriate responses.
 *
 * @param req - Express Request object containing user signup data in the body
 * @param res - Express Response object used to send the API response
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, role } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !role) {
    res.status(400).json({
      statusText: "fail",
      message: "Please provide all required fields",
    });
    return;
  }

  // Validate role
  if (!Object.values(Role).includes(role)) {
    res.status(400).json({
      statusText: "fail",
      message: "Invalid role provided",
    });
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        statusText: "fail",
        message: "User with this email already exists",
      });
      return;
    }

    // Create new user
    const newUser: IUserDocument = await User.create({
      firstName,
      lastName,
      email,
      password,
      provider: Provider.Local,
      role,
    });

    //send verification email
    await sendVerificationEmail(newUser, req);

    // Successful response
    res.status(201).json({
      statusText: "success",
      message: "User created successfully. Please verify your account.",
      data: { userId: newUser._id },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle Mongoose validation error
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message,
      );
      res.status(400).json({
        statusText: "fail",
        message: "Validation error",
        errors: errorMessages,
      });
    } else {
      // Log the error for debugging purposes
      console.error("Error during signup:", error);

      // Send generic error response
      res.status(500).json({
        statusText: "error",
        message: "An error occurred during signup. Please try again later.",
      });
    }
  }
};
