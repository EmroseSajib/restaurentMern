import { Router } from "express";

import { CateringController } from "./catering.controller";

const router = Router();

router.post("/request", CateringController);

export default router;
