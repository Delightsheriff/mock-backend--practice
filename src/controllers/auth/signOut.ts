// import { Request, Response } from "express";
// import { setCookie } from "../../common/utils/helpers";
// import User, { IUserDocument } from "../../models/userModel";
// import { Require_id } from "mongoose";

// export const signOut = async (
//   req: Request & { user?: IUserDocument },
//   res: Response,
// ) => {
//   const user = req;

//   if (!user) {
//     return res.status(401).json({
//       statusText: "fail",
//       message: "You are not signed in",
//     });
//   }

//   try {
//     // setCookie(res, "houseAccessToken", "expired", { maxAge: -1 });
//     // setCookie(res, "houseRefreshToken", "expired", { maxAge: -1 });
//     // const user = await User.findOne({
//     //   refreshToken: req.cookies.houseRefreshToken,
//     // });
//     console.log("User:", user);

//     // if (user) {
//     //   // Clear the refresh token in the database
//     //   user.refreshToken = null;
//     //   await user.save();
//     // }

//     res.status(200).json({
//       statusText: "success",
//       message: "Sign out successful",
//       data: null,
//     });
//   } catch (error) {
//     console.error("Sign-out error:", error);
//     res.status(500).json({
//       statusText: "error",
//       message: "An error occurred while signing out",
//     });
//   }
// };
