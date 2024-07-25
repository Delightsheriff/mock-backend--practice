import { Request, Response } from "express";
import User, { IUserDocument } from "../../models/userModel";
import { deleteFile } from "../../common/utils/upload";
import mongoose from "mongoose";
import { setCookie } from "../../common/utils/helpers";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized. Please log in.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the user to ensure it still exists
    const userToDelete = await User.findById(user._id).session(session);
    if (!userToDelete) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    // Delete associated data (e.g., profile picture)
    if (userToDelete.imageUrl) {
      await deleteFile(userToDelete.imageUrl);
    }

    // Delete user from database
    await User.findByIdAndDelete(user._id).session(session);

    // Commit the transaction
    await session.commitTransaction();

    //clearing the cookies set on the frontend by setting a new cookie with empty values and an expiry time in the past
    setCookie(res, "houseAccessToken", "expired", { maxAge: -1 });
    setCookie(res, "houseRefreshToken", "expired", { maxAge: -1 });

    res.status(200).json({
      status: "success",
      message: "Account successfully deleted.",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting account:", error);
    res.status(500).json({
      status: "error",
      message:
        "An error occurred while deleting the account. Please try again later.",
    });
  } finally {
    session.endSession();
  }
};
