/**
 * Server Configuration and Middleware Setup
 *
 * This file serves as the entry point for the application. It configures the Express
 * server and sets up various middleware for security, logging, and request handling.
 * The middleware is arranged in a specific order to ensure optimal security and performance.
 */

// Import necessary modules
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

// Initialize Express application
const app: Application = express();

// Set up environment variables
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

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
    message: "Too many requests from this IP, please try again in an hour.",
  }),
);

// 9. Logging (only in development mode)
if (ENVIRONMENT.APP.ENV === "development") {
  app.use(morgan("dev"));
}

// Route handling

// Catch-all route for undefined routes
app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({ error: "Route not found", statusCode: 404 });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", statusCode: 500 });
});

export default app;
