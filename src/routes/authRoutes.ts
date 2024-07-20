import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { signIn } from "../controllers/auth/signIn";
import { success } from "../controllers/auth/sucess";
import { forgotPassword } from "../controllers/auth/forgotPassword";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify-email", verifyEmail);
router.get("/email-verified-success", success);
router.post("/forgot-password", forgotPassword);

export default router;
