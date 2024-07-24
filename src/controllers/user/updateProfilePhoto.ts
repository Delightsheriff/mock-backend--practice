import { Request, Response } from "express";
import User, { IUserDocument } from "../../models/userModel";
import { uploadImage } from "../../common/utils/upload";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
  file?: Express.Multer.File;
}

export const updateProfilePhoto = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { file } = req;
  const userID = req.user?._id;

  if (!file) {
    return res.status(404).json({
      statusText: "fail",
      message: "No file uploaded",
    });
  }

  if (!userID) {
    return res.status(401).json({
      statusText: "fail",
      message: "Unauthorized, sign in again",
    });
  }

  try {
    const imageUrl = await uploadImage(file);
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { imageUrl: imageUrl },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        statusText: "fail",
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "User image updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.log("Update error: ", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occured while updating user's photo",
    });
  }
};
