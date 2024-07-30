import {
  PropertyType,
  Purpose,
  ResidentialSubType,
  CommercialSubType,
  IndustrialSubType,
  LandSubType,
  Currency,
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
  const requiredFields = [
    "title",
    "description",
    "purpose",
    "propertyType",
    "subType",
    "size",
    "bedrooms",
    "bathrooms",
    "toilets",
    "slots",
    "stateCapital",
    "localGovernment",
    "address",
    "price",
    "currency",
    "videoUrl",
    "ownerShipDocumentUrl",
  ];
  requiredFields.forEach((field) =>
    checkRequired(field, field.charAt(0).toUpperCase() + field.slice(1)),
  );

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
    let validSubTypes: string[];
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
  const numericFields = [
    "bedrooms",
    "bathrooms",
    "toilets",
    "slots",
    "size",
    "price",
  ];
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

  // Validate currency
  if (data.currency && !Object.values(Currency).includes(data.currency)) {
    errors.push("Invalid currency");
  }

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

  // Validate images
  if (!Array.isArray(data.images) || data.images.length === 0) {
    errors.push("At least one image is required");
  } else {
    data.images.forEach((image: any, index: number) => {
      if (!image || typeof image !== "object" || !image.buffer) {
        errors.push(`Invalid image at index ${index}`);
      }
    });
  }

  // Validate video URL (YouTube)
  if (data.videoUrl) {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(data.videoUrl)) {
      errors.push("Invalid YouTube video URL");
    }
  }

  // Validate ownership document
  if (
    !data.ownershipDocument ||
    typeof data.ownershipDocument !== "object" ||
    !data.ownershipDocument.buffer
  ) {
    errors.push("Ownership document is required");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}
