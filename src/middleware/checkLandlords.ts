import { Response, NextFunction } from "express";
import User from "../models/userModel";
import { Role } from "../common/constants";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export const checkLandlords = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      statusText: "fail",
      message: "Unauthorized: User not authenticated",
    });
  }

  try {
    const userID = req.user?._id;

    const user = await User.findById(userID);
    if (!user || user.role !== Role.LANDLORD) {
      return res.status(403).json({
        statusText: "fail",
        message: "Unauthorized: Only landlords can post properties",
      });
    }

    next();
  } catch (error) {
    console.log("Error in checkLandlords: ", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred while verifying user permissions",
    });
  }
};
