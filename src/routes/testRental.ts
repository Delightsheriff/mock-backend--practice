import { Router } from "express";
import { initializePayment } from "../controllers/Renting/testRental";

const router = Router();

router.post("/acceptpayment", initializePayment);

export default router;
