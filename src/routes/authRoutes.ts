import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { signIn } from "../controllers/auth/signIn";

const router = Router();

router.post("/signup", signUp);
router.get("/verify-email", verifyEmail);
router.post("/signin", signIn);

export default router;
