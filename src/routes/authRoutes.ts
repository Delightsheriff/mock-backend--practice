import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { signIn } from "../controllers/auth/signIn";
import { success } from "../controllers/auth/sucess";
import { forgotPassword } from "../controllers/auth/forgotPassword";
import { resetPassword } from "../controllers/auth/resetPassword";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify-email", verifyEmail);
router.get("/email-verified-success", success);
router.post("/password/forgot-password", forgotPassword);
router.post("/password/reset-password", resetPassword);

export default router;
