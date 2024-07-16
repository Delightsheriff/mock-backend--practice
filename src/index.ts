/**
 * Server Configuration and Middleware Setup
 *
 * This file serves as the entry point for the application. It configures the Express
 * server and sets up various middleware for security, logging, and request handling.
 */

// Import necessary modules
import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import xss from "xss-clean"; // Commented out, but may be used for XSS protection
import mongoSanitize from "express-mongo-sanitize";
import { ENVIRONMENT } from "./common/config/environment";

// Initialize Express application
const app: Application = express();

// Set up environment variables
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;

// Middleware setup

// Parse incoming JSON payloads
app.use(express.json());

// Set security-related HTTP headers
app.use(helmet());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Log API requests in development mode
if (ENVIRONMENT.APP.ENV === "development") {
  app.use(morgan("dev"));
}

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Sanitize data to prevent NoSQL Injection attacks
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Route handling

// Catch-all route for undefined routes
app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({ error: "Route not found", statusText: "fail" });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Export the app
// module.exports = app;  // Commented out, consider using ES6 export syntax instead
