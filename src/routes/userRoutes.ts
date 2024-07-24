import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { updateUser } from "../controllers/user/updateUser";

const router = Router();

router.use(protectRoute);
router.post("/update-user", updateUser);

export default router;
