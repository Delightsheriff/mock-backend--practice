import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { postProperty } from "../controllers/properties/postProperty";
import { getAllProperties } from "../controllers/properties/allProperties";
import { getOwnerProperties } from "../controllers/properties/myProperties";
import { deleteProperty } from "../controllers/properties/deleteProperty";
import { upload } from "../common/utils/upload";

const router = Router();

router.get("/all-properties", getAllProperties);
router.use(protectRoute);
router.post("/post-property", upload.array("files"), postProperty);
router.get("/my-property", getOwnerProperties);
router.delete("/delete-property", deleteProperty);

export default router;
