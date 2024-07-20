import { Response, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { ENVIRONMENT } from "../config/environment";

// Interface for token payload
interface TokenPayload {
  id: string;
  [key: string]: any; // Allow for additional properties
}

/**
 * Sets a cookie with the given name, value, and options
 * @param res - Express response object
 * @param name - Name of the cookie
 * @param value - Value of the cookie
 * @param options - Additional cookie options
 */
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: ENVIRONMENT.APP.ENV === "production",
    path: "/",
    sameSite: "none",
    ...options,
  });
};

/**
 * Generates a JWT token
 * @param payload - Data to be encoded in the token
 * @param secret - Secret key to sign the token
 * @param expiresIn - Token expiration time
 * @returns The generated token
 */
export const generateToken = (
  payload: TokenPayload,
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generates an access token
 * @param userId - ID of the user
 * @returns The generated access token
 */
export const generateAccessToken = (userId: string): string => {
  return generateToken(
    { id: userId },
    ENVIRONMENT.JWT.ACCESS_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.ACCESS,
  );
};

/**
 * Generates a refresh token
 * @param userId - ID of the user
 * @returns The generated refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return generateToken(
    { id: userId },
    ENVIRONMENT.JWT.REFRESH_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.REFRESH,
  );
};

/**
 * Sets an access token cookie
 * @param res - Express response object
 * @param accessToken - The access token to set
 */
export const setAccessTokenCookie = (
  res: Response,
  accessToken: string,
): void => {
  setCookie(res, "houseAccessToken", accessToken, {
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Sets a refresh token cookie
 * @param res - Express response object
 * @param refreshToken - The refresh token to set
 */
export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string,
): void => {
  setCookie(res, "houseRefreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
