import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../models/userModel";
import { Role } from "../common/constants";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}
export const checkLandlords = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
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
      message: "An error occured while checking landlords",
    });
  }
};
