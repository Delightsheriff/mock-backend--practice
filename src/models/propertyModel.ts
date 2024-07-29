import mongoose, { Model, ObjectId, Schema } from "mongoose";
import { IAmenities, IProperty } from "../common/interfaces/property";
import {
  CommercialSubType,
  IndustrialSubType,
  LandSubType,
  PropertyType,
  Purpose,
  ResidentialSubType,
  VerificationStatus,
} from "../common/constants";

export interface IPropertyDocument extends IProperty, Document {
  _id: ObjectId;
}

const amenitiesSchema = new Schema<IAmenities>({
  furnished: { type: Boolean, default: false, required: true },
  parking: { type: Boolean, default: false, required: true },
  gym: { type: Boolean, default: false, required: true },
  swimmingPool: { type: Boolean, default: false, required: true },
  internet: { type: Boolean, default: false, required: true },
  balcony: { type: Boolean, default: false, required: true },
  elevator: { type: Boolean, default: false, required: true },
  wheelchair: { type: Boolean, default: false, required: true },
  dishwasher: { type: Boolean, default: false, required: true },
  petsAllowed: { type: Boolean, default: false, required: true },
  smokingAllowed: { type: Boolean, default: false, required: true },
  fireplace: { type: Boolean, default: false, required: true },
  cableTv: { type: Boolean, default: false, required: true },
  airConditioning: { type: Boolean, default: false, required: true },
  heating: { type: Boolean, default: false, required: true },
  securitySystem: { type: Boolean, default: false, required: true },
  cctv: { type: Boolean, default: false, required: true },
  churchNearby: { type: Boolean, default: false, required: true },
  mosqueNearby: { type: Boolean, default: false, required: true },
});

const PropertySchema = new Schema<IPropertyDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    purpose: {
      type: String,
      enum: Object.values(Purpose),
      required: [true, "Purpose is required"],
    },
    amenities: {
      type: amenitiesSchema,
      required: [true, "Amenities is required"],
    },
    slots: {
      type: Number,
      required: [true, "Slots is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Bedrooms is required"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Bathrooms is required"],
    },
    toilets: {
      type: Number,
      required: [true, "Toilets is required"],
    },
    stateCapital: {
      type: String,
      required: [true, "State Capital is required"],
    },
    localGovernment: {
      type: String,
      required: [true, "Local Government is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
    },
    propertyType: {
      type: String,
      enum: Object.values(PropertyType),
      required: true,
    },
    subType: {
      type: String,
      required: true,
      validate: {
        validator: function (this: IProperty, v: string) {
          switch (this.propertyType) {
            case PropertyType.RESIDENTIAL:
              return Object.values(ResidentialSubType).includes(
                v as ResidentialSubType,
              );
            case PropertyType.COMMERCIAL:
              return Object.values(CommercialSubType).includes(
                v as CommercialSubType,
              );
            case PropertyType.INDUSTRIAL:
              return Object.values(IndustrialSubType).includes(
                v as IndustrialSubType,
              );
            case PropertyType.LAND:
              return Object.values(LandSubType).includes(v as LandSubType);
            default:
              return false;
          }
        },
        message: "Invalid property sub-type for the selected property type.",
      },
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      required: true,
    },
    imagesUrl: {
      type: [String],
      required: [true, "At Least one image is required"],
    },
    videoUrl: {
      type: String,
    },
    ownerShipDocumentUrl: {
      type: String,
      required: [true, "At least one document URL is required"],
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Mongoose model for Property documents
 */

const Property: Model<IPropertyDocument> = mongoose.model<IPropertyDocument>(
  "Property",
  PropertySchema,
);

export default Property;
