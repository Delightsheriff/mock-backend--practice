import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { checkLandlords } from "../middleware/checkLandlords";

const router = Router();

router.use(protectRoute);
router.use(checkLandlords);

export default router;
