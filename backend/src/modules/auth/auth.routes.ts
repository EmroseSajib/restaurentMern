import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import { adminLogin, adminLogout, adminMe } from "./auth.controller";

const router = Router();

router.post("/login", adminLogin);
// router.post("/refresh", adminRefresh);
router.post("/logout", adminLogout);
router.get("/me", requireAdmin, adminMe);

export default router;
