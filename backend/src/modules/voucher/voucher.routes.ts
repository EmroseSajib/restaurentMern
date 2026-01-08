import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import { postCreateVoucher, postValidateVoucher } from "./voucher.controller";

const router = Router();

router.post("/validate", postValidateVoucher);


// admin
router.post("/", requireAdmin, postCreateVoucher);

export default router;
