/**
 * @file userModel.ts
 * @description Defines the Mongoose schema and model for User documents in the application.
 */

import mongoose, { Schema, Model, Document, CallbackError } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { Provider, Role } from "../common/constants";
import { IUser } from "../common/interfaces/user";
import { ObjectId } from "mongoose";

/**
 * Interface for User documents in the database.
 * Extends IUser (which defines basic user properties) and Document (for Mongoose document methods)
 */
export interface IUserDocument extends IUser, Document {
  _id: ObjectId;
  fullName: string; // Virtual property
  comparePassword(candidatePassword: string): Promise<boolean>; // Method to compare passwords
}

/**
 * Mongoose schema definition for User documents
 */
const UserSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      set: (v: string) => v.toLowerCase(), // Converts to lowercase before saving
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      set: (v: string) => v.toLowerCase(), // Converts to lowercase before saving
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"], // Custom validator
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Excludes password from query results by default
    },
    role: {
      type: String,
      enum: Object.values(Role), // Restricts values to those defined in Role enum
      required: [true, "Role is required"],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpiresAt: Date,
    provider: {
      type: String,
      enum: Object.values(Provider), // Restricts values to those defined in Provider enum
      default: Provider.Local,
    },
    googleId: String,
    refreshToken: String,
    properties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Includes virtual properties when document is converted to JSON
    toObject: { virtuals: true }, // Includes virtual properties when document is converted to a plain object
  },
);

/**
 * Virtual property for full name
 * Combines firstName and lastName
 */
UserSchema.virtual("fullName").get(function (this: IUserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Pre-save middleware to handle the properties field based on user role
 * Ensures LANDLORD users have an array for properties, while other roles have it null
 */
UserSchema.pre("save", function (this: IUserDocument, next) {
  if (this.role === Role.LANDLORD) {
    this.properties = this.properties || [];
  } else {
    this.properties = null;
  }
  next();
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified (or is new)
 */
UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

/**
 * Method to compare a given password with the user's hashed password
 * @param candidatePassword - The password to compare
 * @returns A promise that resolves to a boolean indicating whether the passwords match
 */
UserSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Mongoose model for User documents
 */
const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  UserSchema,
);

export default User;
