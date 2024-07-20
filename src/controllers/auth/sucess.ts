import { Request, Response } from "express";

export const success = async (req: Request, res: Response): Promise<void> => {
  res.send(
    "Email verified successfully. You can now close this page and return to the app.",
  );
};
