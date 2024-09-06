import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { postProperty } from "../controllers/properties/postProperty";
import { getAllProperties } from "../controllers/properties/allProperties";
import { getOwnerProperties } from "../controllers/properties/myProperties";
import { deleteProperty } from "../controllers/properties/deleteProperty";
import { upload } from "../common/utils/upload";
import { getProperty } from "../controllers/properties/getProperty";

const router = Router();

router.get("/all-properties", getAllProperties);
router.get("/get-property/:id", getProperty);
router.use(protectRoute);
router.post(
  "/post-property",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "ownershipDocument", maxCount: 1 },
    // { name: "video", maxCount: 1 },
  ]),
  postProperty,
);
router.get("/my-property", getOwnerProperties);
router.delete("/delete-property", deleteProperty);

export default router;
