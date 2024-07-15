/*
import express
 */

import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
// import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
const app: Application = express();

// express middleware to parse incoming requests with JSON payloads
app.use(express.json());

//Use Helmet middleware for security headers
app.use(helmet());

//Enabling Cors
app.use(cors());

//Data sanitization against XSS
// app.use(xss());

//Data sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
