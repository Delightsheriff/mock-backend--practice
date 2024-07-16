import type { IEnvironmant } from "../interfaces/environment";
import dotenv from "dotenv";

dotenv.config();

export const ENVIRONMENT: IEnvironmant = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: parseInt(process.env.PORT || "2024"),
    ENV: process.env.NODE_ENV,
    CLIENT: process.env.CLIENT,
  },
  DB: {
    URL: process.env.DB_URL!,
  },
  JWT: {
    REFRESH_KEY: process.env.REFRESH_JWT_KEY!,
    ACCESS_KEY: process.env.ACCESS_JWT_KEY!,
  },
  JWT_EXPIRES_IN: {
    REFRESH: process.env.REFRESH_JWT_EXPIRES_IN!,
    ACCESS: process.env.ACCESS_JWT_EXPIRES_IN!,
  },
};
