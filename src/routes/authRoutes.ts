import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { signIn } from "../controllers/auth/signIn";
import { success } from "../controllers/auth/sucess";
import { forgotPassword } from "../controllers/auth/forgotPassword";
import { resetPassword } from "../controllers/auth/resetPassword";
import { resendVerificationEmail } from "../controllers/auth/resendVerificationEmail";
import { protectRoute } from "../middleware/protectRoute";
import { signOut } from "../controllers/auth/signOut";
import { handleSession } from "../controllers/auth/session";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/verify-email", verifyEmail);
router.get("/email-verified-success", success);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/password/forgot-password", forgotPassword);
router.post("/password/reset-password", resetPassword);

//TODO: implement protected routes
router.use(protectRoute);
router.get("/session", handleSession);
router.get("/signout", signOut);

export default router;
