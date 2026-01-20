import { Router } from "express";
import {
  getOrder,
  OrdersControllerCash,
  OrdersControllerStripe,
  postOrder,
  postStripeCheckout,
} from "./orders.controller";

const router = Router();

// Public
router.post("/", postOrder);
router.get("/:id", getOrder);

// Public (called after order created if paymentMethod=stripe)
router.post("/:id/stripe/checkout", postStripeCheckout);
router.post("/orders/cod", OrdersControllerCash);
router.post("/stripe/checkout", OrdersControllerStripe);

export default router;
