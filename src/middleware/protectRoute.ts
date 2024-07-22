// import { AppError, authenticate, setCookie } from "@/common/utils";
// import { catchAsync } from "@/middlewares";
import type { NextFunction, Request, Response } from "express";
import { setAccessTokenCookie } from "../common/utils/helpers";
import { authenticateUser } from "../common/utils/authenticateUser";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
};
