/**
 * @file User.js
 * @description Defines the Mongoose schema and model for User documents in the application.
 */

import { CallbackError, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { Provider, Role } from "../common/constants";

/**
 * @typedef {Object} UserDocument
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {string} email - The user's email address
 * @property {string} password - The user's hashed password
 * @property {Role} role - The user's role in the system
 * @property {boolean} [isEmailVerified] - Whether the user's email has been verified
 * @property {string} [imageUrl] - URL to the user's profile image
 * @property {Provider} provider - The authentication provider
 * @property {string} [googleId] - Google ID for users authenticated via Google
 * @property {string} [refreshToken] - Refresh token for authentication
 * @property {Schema.Types.ObjectId[]} [properties] - Array of Property IDs owned by the user
 */

/**
 * Mongoose schema definition for the User model.
 * @type {Schema<UserDocument>}
 */
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
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
    provider: {
      type: String,
      enum: Object.values(Provider),
      required: true,
      default: Provider.Local,
    },
    googleId: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    properties: {
      type: [{ type: Schema.Types.ObjectId, ref: "Property" }],
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Pre-save middleware to handle the properties field based on user role.
 */
UserSchema.pre("save", function (next) {
  if (this.role === Role.LANDLORD) {
    if (!this.properties) {
      this.properties = [];
    }
  } else {
    this.properties = undefined;
  }
  next();
});

/**
 * Pre-save middleware to hash password before saving.
 */
UserSchema.pre("save", async function (next) {
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
 * Virtual for user's full name.
 * @type {Schema.VirtualType}
 */
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * Mongoose model for User documents.
 * @type {import('mongoose').Model<UserDocument>}
 */
const User = model("User", UserSchema);

export default User;
