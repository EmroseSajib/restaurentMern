import { Router } from "express";
import { GiftVouchersController } from "./giftVouchers.controller";

const router = Router();

router.post("/stripe/checkout", GiftVouchersController);

export default router;
