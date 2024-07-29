import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import Property, { IPropertyDocument } from "../../models/propertyModel";
import {
  uploadImage,
  uploadMultipleFiles,
  uploadVideo,
} from "../../common/utils/upload";
import { VerificationStatus } from "../../common/constants";
import { notifyAdminForApproval } from "../../common/utils/assignAdmin";
import { validateProperty } from "../../common/utils/validateProperty";

export const postProperty = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        statusText: "fail",
        message: "Unauthorized: User not authenticated",
      });
    }
    //TODO: Implement property validation from request
    // Validate the property data
    const validationResult = validateProperty(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        statusText: "fail",
        message: "Invalid property data",
        errors: validationResult.errors,
      });
    }

    // Handle file uploads
    let imagesUrl: string[] = [];
    let ownerShipDocumentUrl: string = "";
    let videoUrl: string = "";

    if (req.files && req.files.images) {
      imagesUrl = await uploadMultipleFiles(req.files.images);
    }

    if (
      req.files &&
      req.files.ownershipDocument &&
      req.files.ownershipDocument[0]
    ) {
      ownerShipDocumentUrl = await uploadImage(req.files.ownershipDocument[0]);
    }

    if (req.files && req.files.video && req.files.video[0]) {
      videoUrl = await uploadVideo(req.files.video[0]);
    }

    // Create a new property document
    const newProperty: IPropertyDocument = new Property({
      ...req.body,
      owner: req.user._id,
      verificationStatus: VerificationStatus.Pending,
      isVerified: false,
      imagesUrl,
      ownerShipDocumentUrl,
      videoUrl,
    });
    // TODO: Implement notification to admin for approval
    await notifyAdminForApproval(newProperty._id);

    res.status(201).json({
      statusText: "success",
      message: "Property submitted for approval",
      data: {
        propertyId: newProperty._id,
      },
    });
  } catch (error) {
    console.error("Error in submitProperty:", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred while submitting the property",
    });
  }
};
