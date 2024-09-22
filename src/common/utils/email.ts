import jwt from "jsonwebtoken";
import { ENVIRONMENT } from "../config/environment";

interface ITokenData {
  id: string;
}

export const generateEmailVerificationToken = (
  userId: string,
  expiresIn: string = "24h",
) => {
  const token = jwt.sign({ id: userId }, ENVIRONMENT.JWT.ACCESS_KEY, {
    expiresIn,
  });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  console.log("Generated token:", token);
  return { token, expiresAt };
};

export const verifyEmailToken = (token: string): ITokenData | null => {
  try {
    // console.log("Token for verification:", token);
    const decoded = jwt.verify(token, ENVIRONMENT.JWT.ACCESS_KEY) as ITokenData;
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error verifying email token:", error);
    return null;
  }
};

export const isTokenExpired = (expirationDate: Date): boolean => {
  return expirationDate < new Date();
};
