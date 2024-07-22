import { Require_id } from "mongoose";
import { IUserDocument } from "../../models/userModel";
// import { IUserDocument } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: Require_id<IUserDocument>;
    }
  }
}
