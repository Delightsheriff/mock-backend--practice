import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import User from "../../models/userModel";
import { validatePropertyData } from "../../common/utils/validateProperty";

export async function postProperty(req: AuthenticatedRequest, res: Response) {
  try {
    console.log("Body:", req.body); // Log the body to see what's coming through
    console.log("Files:", req.files);
    console.log("File:", req.file);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userId = req.user._id;

    // Fetch the user's role from the database
    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "landlord") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only landlords can access this resource",
      });
    }

    // Validate the incoming data
    const validationErrors = validatePropertyData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle file uploads
    // const imagesUrls = await uploadImages(req.files.images);
    // const ownershipDocumentUrl = await uploadOwnershipDocument(
    //   req.files.ownershipDocument,
    // );

    // Create a new property object
    // const newProperty: IPropertyDocument = new Property({
    //   ...req.body,
    //   owner: req.user._id,
    //   imagesUrl: imagesUrls,
    //   ownerShipDocumentUrl: ownershipDocumentUrl,
    //   isVerified: false,
    //   verificationStatus: "Pending",
    // });

    // Save the property to the database
    // await newProperty.save();

    // // Send for approval
    // await sendForApproval(newProperty._id);

    // return res.status(201).json({
    //   success: true,
    //   message: "Property submitted for approval",
    //   data: {
    //     propertyId: newProperty._id,
    //   },
    // });
  } catch (error) {
    console.error("Error posting property:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
