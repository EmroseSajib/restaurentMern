import { Router } from "express";
import { getOrder, postOrder, postStripeCheckout } from "./orders.controller";

const router = Router();

// Public
router.post("/", postOrder);
router.get("/:id", getOrder);

// Public (called after order created if paymentMethod=stripe)
router.post("/:id/stripe/checkout", postStripeCheckout);

export default router;
