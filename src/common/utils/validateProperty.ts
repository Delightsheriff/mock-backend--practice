import {
  PropertyType,
  Purpose,
  ResidentialSubType,
  CommercialSubType,
  IndustrialSubType,
  LandSubType,
} from "../constants/index";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProperty(data: any): ValidationResult {
  const errors: string[] = [];

  // Helper function to check if a field exists and is not empty
  const checkRequired = (field: string, fieldName: string) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors.push(`${fieldName} is required`);
    }
  };

  // Check required fields
  checkRequired("title", "Title");
  checkRequired("purpose", "Purpose");
  checkRequired("propertyType", "Property Type");
  checkRequired("subType", "Sub Type");
  checkRequired("description", "Description");
  checkRequired("stateCapital", "State Capital");
  checkRequired("localGovernment", "Local Government");
  checkRequired("address", "Address");

  // Validate purpose
  if (data.purpose && !Object.values(Purpose).includes(data.purpose)) {
    errors.push("Invalid purpose");
  }

  // Validate property type
  if (
    data.propertyType &&
    !Object.values(PropertyType).includes(data.propertyType)
  ) {
    errors.push("Invalid property type");
  }

  // Validate sub type based on property type
  if (data.propertyType && data.subType) {
    let validSubTypes: string | any[];
    switch (data.propertyType) {
      case PropertyType.RESIDENTIAL:
        validSubTypes = Object.values(ResidentialSubType);
        break;
      case PropertyType.COMMERCIAL:
        validSubTypes = Object.values(CommercialSubType);
        break;
      case PropertyType.INDUSTRIAL:
        validSubTypes = Object.values(IndustrialSubType);
        break;
      case PropertyType.LAND:
        validSubTypes = Object.values(LandSubType);
        break;
      default:
        validSubTypes = [];
    }
    if (!validSubTypes.includes(data.subType)) {
      errors.push("Invalid sub type for the selected property type");
    }
  }

  // Validate numeric fields
  const numericFields = ["bedrooms", "bathrooms", "toilets", "size"];
  numericFields.forEach((field) => {
    if (data[field] !== undefined) {
      const value = Number(data[field]);
      if (isNaN(value) || value < 0) {
        errors.push(
          `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } must be a non-negative number`,
        );
      }
    }
  });

  // Validate amenities
  if (data.amenities) {
    const validAmenities = [
      "furnished",
      "parking",
      "gym",
      "swimmingPool",
      "internet",
      "balcony",
      "elevator",
      "wheelchair",
      "dishwasher",
      "petsAllowed",
      "smokingAllowed",
      "fireplace",
      "cableTv",
      "airConditioning",
      "heating",
      "securitySystem",
      "cctv",
      "churchNearby",
      "mosqueNearby",
    ];
    Object.keys(data.amenities).forEach((amenity) => {
      if (!validAmenities.includes(amenity)) {
        errors.push(`Invalid amenity: ${amenity}`);
      }
      if (typeof data.amenities[amenity] !== "boolean") {
        errors.push(`Amenity ${amenity} must be a boolean value`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}
