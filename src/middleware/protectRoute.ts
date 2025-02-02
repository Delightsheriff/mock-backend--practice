import type { NextFunction, Request, Response } from "express";
import { setAccessTokenCookie } from "../common/utils/helpers";
import { authenticateUser } from "../common/utils/authenticateUser";
import { IUserDocument } from "../models/userModel";

export const protectRoute = async (
  req: Request & { user?: IUserDocument },
  res: Response,
  next: NextFunction,
) => {
  try {
    // get the cookies from the request headers
    const { houseAccessToken, houseRefreshToken } = req.cookies;

    const { currentUser, accessToken } = await authenticateUser({
      houseAccessToken,
      houseRefreshToken,
    });

    if (accessToken) {
      setAccessTokenCookie(res, accessToken);
    }

    // attach the user to the request object
    req.user = currentUser;

    next();
  } catch (error) {
    return res.status(401).json({
      statusText: "error",
      message: "Unauthorized, Please Login",
    });
  }
};
