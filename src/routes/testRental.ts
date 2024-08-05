import { Router } from "express";
import { initializePayment } from "../controllers/testRental";

const router = Router();

router.post("/acceptpayment", initializePayment);

export default router;
