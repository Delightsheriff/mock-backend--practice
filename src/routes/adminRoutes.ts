import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { reviewProperty } from "../controllers/admins/reviewProperty";

const router = Router();

router.use(protectRoute);
router.post("/review-property/", reviewProperty);

export default router;
