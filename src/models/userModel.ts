import { Schema, model } from "mongoose";
import validator from "validator";
import { Provider, Role } from "../common/constants";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: [true, "Role is required"],
    },
    imageUrl: {
      type: String,
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
  },
  { timestamps: true },
);

const User = model("User", UserSchema);
module.exports = User;
