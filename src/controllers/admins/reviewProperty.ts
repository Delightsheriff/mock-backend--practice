import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/AuthenticatedRequest";
import { Role } from "../../common/constants";
import Property from "../../models/propertyModel";
import User from "../../models/userModel";
import { ObjectId } from "mongoose";

export async function reviewProperty(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || req.user.role !== Role.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins can review properties",
      });
    }

    const { propertyId } = req.params;
    const { verificationStatus, reviewComments } = req.body;

    if (!["Approved", "Rejected"].includes(verificationStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification status" });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    property.verificationStatus = verificationStatus;
    property.reviewComments = reviewComments || undefined;
    property.reviewedBy = req.user._id;
    property.reviewedAt = new Date();

    await property.save();

    // Remove the property from the admin's review list
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { propertiesToReview: propertyId },
    });

    //TODO: Implement a notification system to notify the property owner about the review result

    return res.status(200).json({
      success: true,
      message: "Property review completed successfully",
      data: { propertyId, verificationStatus, reviewComments },
    });
  } catch (error) {
    console.error("Error reviewing property:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
