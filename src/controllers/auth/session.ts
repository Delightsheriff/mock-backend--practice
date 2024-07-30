import { Request, Response } from "express";
import { IUserDocument } from "../../models/userModel";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

export const handleSession = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const currentUser = req.user;
  if (!currentUser) {
    return res.status(401).json({
      statusText: "error",
      message: "Unauthenticated",
    });
  }

  res.status(200).json({
    statusText: "success",
    message: "Authenticated",
    currentUser,
  });
};
