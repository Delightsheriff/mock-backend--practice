import { Request } from "express";
import { IUserDocument } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
  // files?: {
  //   images?: Express.Multer.File[];
  //   ownershipDocument?: Express.Multer.File[];
  //   video?: Express.Multer.File[];
  // };
}
