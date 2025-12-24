import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import {
  createCategory,
  createMenuItem,
  getCategories,
  getMenu,
} from "./menu.controller";

const router = Router();

// Public
router.get("/categories", getCategories);
router.get("/", getMenu);

// Admin
router.post("/categories", requireAdmin, createCategory);
router.post("/items", requireAdmin, createMenuItem);

export default router;
