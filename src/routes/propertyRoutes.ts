import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { postProperty } from "../controllers/properties/postProperty";
import { getAllProperties } from "../controllers/properties/allProperties";
import { getOwnerProperties } from "../controllers/properties/myProperties";

const router = Router();

router.get("/all-properties", getAllProperties);
router.use(protectRoute);
router.post("/post-property", postProperty);
router.get("/my-property", getOwnerProperties);

export default router;
