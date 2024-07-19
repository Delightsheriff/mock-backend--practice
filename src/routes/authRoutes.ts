import { Router } from "express";
import { signUp } from "../controllers/auth/signUp";
// import { verifyEmail } from "../controllers/auth/verifyEmail";

const router = Router();

router.post("/signup", signUp);
// router.get("/verify-email", verifyEmail);

export default router;
