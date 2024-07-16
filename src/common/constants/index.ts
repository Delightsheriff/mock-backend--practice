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
