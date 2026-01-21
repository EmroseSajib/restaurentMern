import { Router } from "express";
import adminRoutes from "../modules/admin/admin.routes";
import adminOrdersRoutes from "../modules/adminOrders/adminOrders.routes";
import authRoutes from "../modules/auth/auth.routes";
import cateringRoutes from "../modules/catering/cateringRoutes";
import giftVouchersRoutes from "../modules/giftVouchers/giftVouchers.routes";
import membershipRoutes from "../modules/membership/membership.routes";
import menuRoutes from "../modules/menu/menu.routes";
import ordersRoutes from "../modules/orders/orders.routes";
import reservationRoutes from "../modules/reservation/reservation.routes";
import settingsRoutes from "../modules/settings/settings.routes";
import voucherRoutes from "../modules/voucher/voucher.routes";

const router = Router();

router.use("/admin/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/menu", menuRoutes);
router.use("/orders", ordersRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/memberships", membershipRoutes);
router.use("/reservations", reservationRoutes);
router.use("/catering", cateringRoutes);
router.use("/settings", settingsRoutes);
router.use("/admin", adminOrdersRoutes);
router.use("/payments", ordersRoutes);
router.use("/gift-vouchers", giftVouchersRoutes);

export default router;
