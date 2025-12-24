import { Router } from "express";
import { postValidateMembership } from "./membership.controller";

const router = Router();

router.post("/validate", postValidateMembership);

export default router;
