import { Require_id } from "mongoose";
import { IUserDocument } from "../../models/userModel";
`1`;
// import { IUserDocument } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: Require_id<IUserDocument>;
      file?: Express.Multer.File;
    }
  }
}
