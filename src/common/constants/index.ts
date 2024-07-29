export enum Role {
  ADMIN = "admin",
  TENANT = "tenant",
  LANDLORD = "landlord",
}

export enum JWTExpiresIn {
  Access = 15 * 60 * 1000,
  Refresh = 24 * 60 * 60 * 1000,
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
  None = "none",
}
export enum Provider {
  Local = "local",
  Google = "google",
}
export enum Purpose {
  Rent = "rent",
  Sell = "sell",
  Lease = "lease",
}

export enum PropertyType {
  RESIDENTIAL = "residential",
  COMMERCIAL = "commercial",
  INDUSTRIAL = "industrial",
  LAND = "land",
}

export enum ResidentialSubType {
  BoysQuarters = "boys_quarters",
  Bungalow = "bungalow",
  Duplex = "duplex",
  SelfContain = "self_contain",
  Penthouse = "penthouse",
  MiniFlat = "mini_flat",
}

export enum CommercialSubType {
  Hotel = "hotel",
  OfficeSpace = "office_space",
  Shop = "shop",
  Restaurant = "restaurant",
  EventCenter = "event_center",
  School = "school",
  Hospital = "hospital",
  FillingStation = "filling_station",
  Workshop = "workshop",
  Showroom = "showroom",
  PrivateOffice = "private_office",
}

export enum IndustrialSubType {
  Warehouse = "warehouse",
  Factory = "factory",
}

export enum LandSubType {
  ResidentialLot = "residential_lot",
  CommercialLot = "commercial_lot",
  Agricultural = "agricultural",
  Recreational = "recreational",
}

export enum PaymentStatus {
  Pending = "pending",
  Success = "success",
  Failed = "failed",
}

export enum VerificationStatus {
  Pending = "pending",
  Verified = "verified",
  Rejected = "rejected",
}
