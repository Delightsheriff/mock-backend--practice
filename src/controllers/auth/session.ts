// import { Request, Response } from "express";
import { IUserDocument } from "../../models/userModel";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

// export const handleSession = async (
//   req: AuthenticatedRequest,
//   res: Response,
// ) => {
//   try {
//     const currentUser = req.user;
//     if (!currentUser) {
//       return res.status(401).json({
//         statusText: "error",
//         message: "Unauthenticated",
//       });
//     }

//     res.status(200).json({
//       statusText: "success",
//       message: "Authenticated",
//       currentUser,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

import { Request, Response } from "express";
import User from "../../models/userModel";
// import { IUserDocument, UserModel } from "../../models/userModel";

// interface AuthenticatedRequest extends Request {
//   user?: { _id: string };
// }

export const handleSession = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        statusText: "error",
        message: "Unauthenticated",
      });
    }

    const currentUser = await User.findById(userId).select("-password");
    if (!currentUser) {
      return res.status(404).json({
        statusText: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      statusText: "success",
      message: "Authenticated",
      currentUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusText: "error",
      message: "Internal server error",
    });
  }
};
