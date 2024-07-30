import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { postProperty } from "../controllers/properties/postProperty";
import { getAllProperties } from "../controllers/properties/allProperties";

const router = Router();

router.get("/all-properties", getAllProperties);
router.use(protectRoute);
router.post("/post-property", postProperty);

export default router;
