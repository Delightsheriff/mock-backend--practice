import { Request, Response } from "express";
import { setCookie } from "../../common/utils/helpers";
import User, { IUserDocument } from "../../models/userModel";
// import { Require_id } from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

export const signOut = async (req: AuthenticatedRequest, res: Response) => {
  const temp = req.user;
  if (!temp) {
    return res.status(401).json({
      statusText: "fail",
      message: "You are not signed in",
    });
  }

  try {
    // console.log("User:", .user);
    console.log("User ID:", temp._id);

    await User.findByIdAndUpdate(temp._id, { $unset: { refreshToken: 1 } });

    //clearing the cookies set on the frontend by setting a new cookie with empty values and an expiry time in the past
    setCookie(res, "houseAccessToken", "expired", { maxAge: -1 });
    setCookie(res, "houseRefreshToken", "expired", { maxAge: -1 });

    res.status(200).json({
      statusText: "success",
      message: "Sign out successful",
      data: null,
    });
  } catch (error) {
    console.error("Sign-out error:", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred while signing out",
    });
  }
};
