import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import Property from "../../models/propertyModel";
import {
  uploadImage,
  uploadMultipleFiles,
  uploadVideo,
} from "../../common/utils/upload";
import { Role, VerificationStatus } from "../../common/constants";
import { notifyAdminForApproval } from "../../common/utils/assignAdmin";
import { validateProperty } from "../../common/utils/validateProperty";
import User from "../../models/userModel";

/**
 * Handles the asynchronous submission of a new property listing.
 *
 * This function performs the following steps:
 * 1. Authenticates the user
 * 2. Validates the property data
 * 3. Uploads any associated files (images, ownership documents, videos)
 * 4. Creates and saves a new property document in the database
 * 5. Notifies an admin for approval
 *
 * @param req - The authenticated request object containing the property data and files
 * @param res - The response object used to send the result back to the client
 */
export const postProperty = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({
      statusText: "fail",
      message: "Unauthorized: User not authenticated",
    });
  }
  try {
    // const userID = req.user?._id;

    // const user = await User.findById(userID);
    // if (!user || user.role !== Role.LANDLORD) {
    //   return res.status(403).json({
    //     statusText: "fail",
    //     message: "Unauthorized: Only landlords can post properties",
    //   });
    // }
    // Validate the property data
    const validationResult = validateProperty(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        statusText: "fail",
        message: "Invalid property data",
        errors: validationResult.errors,
      });
    }

    // // Handle file uploads
    // const [imagesUrl, ownerShipDocumentUrl, videoUrl] = await Promise.all([
    //   req.files?.images ? uploadMultipleFiles(req.files.images) : [],
    //   req.files?.ownershipDocument?.[0]
    //     ? uploadImage(req.files.ownershipDocument[0])
    //     : "",
    //   req.files?.video?.[0] ? uploadVideo(req.files.video[0]) : "",
    // ]);

    // // Create and save a new property document
    // const newProperty = new Property({
    //   ...req.body,
    //   owner: req.user._id,
    //   verificationStatus: VerificationStatus.Pending,
    //   isVerified: false,
    //   imagesUrl,
    //   ownerShipDocumentUrl,
    //   videoUrl,
    // });

    // const savedProperty = await newProperty.save();

    // // Notify admin for approval
    // await notifyAdminForApproval(savedProperty._id);

    // // Send success response
    // res.status(201).json({
    //   statusText: "success",
    //   message: "Property submitted for approval",
    //   data: {
    //     propertyId: savedProperty._id,
    //   },
    // });
  } catch (error) {
    console.error("Error in postProperty:", error);
    res.status(500).json({
      statusText: "error",
      message: "An error occurred while submitting the property",
    });
  }
};
