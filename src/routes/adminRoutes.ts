import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";

const router = Router();

router.use(protectRoute);

export default router;
