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
    // secure: true,
    secure: ENVIRONMENT.APP.ENV === "production", // Only use secure in production
    path: "/",
    sameSite: ENVIRONMENT.APP.ENV === "production" ? "none" : "lax", // Use 'lax' for local development

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

export class AuthenticationError extends Error {
  statusCode: number;
  statusText: string;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = statusCode;
    this.statusText = "fail";
  }
}

/**
 * Verifies a JWT token
 * @param token - The token to verify
 * @param secret - The secret key used to sign the token
 * @returns The decoded token payload
 * @throws AuthenticationError if the token is invalid
 */
const verifyToken = (token: string, secret: string): TokenPayload => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    throw new AuthenticationError("Invalid token");
  }
};

/**
 * Verifies an access token
 * @param accessToken - The access token to verify
 * @returns The decoded access token payload
 * @throws AuthenticationError if the token is invalid
 */
export const verifyAccessToken = (accessToken: string): TokenPayload => {
  return verifyToken(accessToken, ENVIRONMENT.JWT.ACCESS_KEY);
};

/**
 * Verifies a refresh token
 * @param refreshToken - The refresh token to verify
 * @returns The decoded refresh token payload
 * @throws AuthenticationError if the token is invalid
 */
export const verifyRefreshToken = (refreshToken: string): TokenPayload => {
  return verifyToken(refreshToken, ENVIRONMENT.JWT.REFRESH_KEY);
};
