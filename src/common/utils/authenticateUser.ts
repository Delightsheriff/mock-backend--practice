import { Require_id } from "mongoose";
import User, { IUserDocument } from "../../models/userModel";
import {
  AuthenticationError,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./helpers";
import jwt from "jsonwebtoken";

type AuthenticateResult = {
  currentUser: Require_id<IUserDocument>;
  accessToken?: string;
};

export const authenticateUser = async ({
  houseAccessToken,
  houseRefreshToken,
}: {
  houseAccessToken?: string;
  houseRefreshToken?: string;
}): Promise<AuthenticateResult> => {
  if (!houseRefreshToken) {
    throw new AuthenticationError("Unauthorized");
  }

  // verify user access
  const handleUserVerification = async (decoded: any) => {
    // fetch user from redis cache or db

    const user = (await User.findOne({ _id: decoded.id }).select(
      "refreshToken  isEmailVerified",
    )) as Require_id<IUserDocument>;

    // check if refresh token matches the stored refresh token in db
    // in case the user has logged out and the token is still valid
    // or the user has re authenticated and the token is still valid etc

    if (user.refreshToken !== houseRefreshToken) {
      throw new AuthenticationError("Invalid token. Please log in again!", 401);
    }

    if (!user.isEmailVerified) {
      throw new AuthenticationError("Your email is yet to be verified", 422);
    }

    return user;
  };

  const handleTokenRefresh = async () => {
    try {
      const decodeRefreshToken = await verifyRefreshToken(houseRefreshToken);
      const currentUser = await handleUserVerification(decodeRefreshToken);

      // generate access tokens
      const accessToken = await generateAccessToken(currentUser._id.toString());

      return {
        accessToken,
        currentUser,
      };
    } catch (error) {
      console.log(error);
      throw new AuthenticationError(
        "Session expired, please log in again",
        401,
      );
    }
  };

  try {
    if (!houseAccessToken) {
      // if access token is not present, verify the refresh token and generate a new access token
      return await handleTokenRefresh();
    } else {
      const decodeAccessToken = await verifyAccessToken(houseAccessToken);
      const currentUser = await handleUserVerification(decodeAccessToken);

      // attach the user to the request object
      return { currentUser };
    }
  } catch (error) {
    if (
      (error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError) &&
      houseRefreshToken
    ) {
      // verify the refresh token and generate a new access token
      return await handleTokenRefresh();
    } else {
      throw new AuthenticationError(
        "An error occurred, please log in again",
        401,
      );
    }
  }
};
