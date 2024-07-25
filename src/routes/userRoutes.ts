import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute";
import { updateUser } from "../controllers/user/updateUser";
import { updateProfilePhoto } from "../controllers/user/updateProfilePhoto";
import { upload } from "../common/utils/upload";

const router = Router();

router.use(protectRoute);
router.post("/update-user", updateUser);
router.post("/update-photo", upload.single("photo"), updateProfilePhoto);

export default router;
