/**
 * Server Configuration and Middleware Setup
 *
 * This file serves as the entry point for the application. It configures the Express
 * server and sets up various middleware for security, logging, and request handling.
 * The middleware is arranged in a specific order to ensure optimal security and performance.
 */

import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { ENVIRONMENT } from "./common/config/environment";
// import { authRouter } from "./routes/authRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import adminRoutes from "./routes/adminRoutes";

// Initialize Express application
const app: Application = express();

// Middleware setup (in order of application)

// 1. Set security-related HTTP headers
app.use(helmet());

// 2. Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// 3. Parse incoming JSON payloads (limit to 10kb to prevent large payload attacks)
app.use(express.json({ limit: "10kb" }));

// 4. Parse cookies
app.use(cookieParser());

// 5. Data sanitization against NoSQL Injection attacks
app.use(mongoSanitize());

// 6. Data sanitization against XSS attacks
app.use(xss());

// 7. Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// 8. Rate limiting to prevent brute-force attacks
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    limit: 1000, // Limit each IP to 1000 requests per window
    message: "Rate limit exceeded. Please try again later.",
  }),
);

// 9. Logging (only in development mode)
if (ENVIRONMENT.APP.ENV === "development") {
  app.use(morgan("dev"));
}

// Route handling

/**
 * API Auth routes
 * @route POST /api/v1/auth
 * @group Auth - Authentication Management
 */
app.use("/api/v1/auth", authRoutes);

/**
 * API User routes
 * @route POST, PATCH, DELETE /api/v1/auth
 * @group User - User Management
 */
app.use("/api/v1/user", userRoutes);

/**
 * API Property routes
 * @route POST, PATCH, DELETE /api/v1/property
 * @group Property - Property Management
 */
app.use("/api/v1/property", propertyRoutes);

/**
 * API Admin routes
 * @route POST, PATCH, DELETE /api/v1/admin
 * @group Admin - Admin Management
 *
 */
app.use("/api/v1/admin", adminRoutes);

/**
 * API welcome route
 * @route GET /api/v1
 * @returns {Object} 200 - Success response
 */
app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({
    statusText: "success",
    message: "Welcome to Home-finder API",
  });
});

/**
 * Catch-all route for undefined routes
 * @route GET *
 * @returns {Object} 404 - Not Found response
 */
app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({
    statusText: "fail",
    message: "The requested resource could not be found",
  });
});

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    statusText: "fail",
    message: "An unexpected error occurred. Please try again later.",
  });
});

export default app;
