import { Schema } from "mongoose";
import {
  CommercialSubType,
  IndustrialSubType,
  LandSubType,
  PropertyType,
  Purpose,
  ResidentialSubType,
  VerificationStatus,
} from "../constants";

interface IAmenities {
  furnished: boolean;
  parking: boolean;
  gym: boolean;
  swimmingPool: boolean;
  internet: boolean;
  balcony: boolean;
  elevator: boolean;
  wheelchair: boolean;
  dishwasher: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  fireplace: boolean;
  cableTv: boolean;
  airConditioning: boolean;
  heating: boolean;
  securitySystem: boolean;
  cctv: boolean;
  churchNearby: boolean;
  mosqueNearby: boolean;
}

export interface IProperty {
  owner: Schema.Types.ObjectId[];
  title: string;
  purpose: Purpose;
  amenities: IAmenities;
  slots: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  stateCapital: string;
  localGovernment: string;
  isVerified: boolean;
  address: string;
  size: number;
  toilets: number;
  propertyType: PropertyType;
  subType:
    | ResidentialSubType
    | CommercialSubType
    | IndustrialSubType
    | LandSubType;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}
