import { pusher } from "../../config/pusher";
import { MenuItemModel } from "../../models/MenuItem.model";
import { OrderModel } from "../../models/Order.model";
import { ApiError } from "../../utils/apiError";
import { validateMembership } from "../membership/membership.service";
import { validateVoucher } from "../voucher/voucher.service";

function money(amount: number, currency = "EUR") {
  return { amount, currency };
}

function genOrderNumber() {
  // simple unique-ish; you can replace with better scheme later
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DKM-${y}${m}${d}-${rand}`;
}

export async function createOrder(input: {
  customer: { name: string; phone: string; email?: string };
  fulfillment: {
    type: "delivery" | "pickup";
    address?: {
      line1?: string;
      postalCode?: string;
      city?: string;
      country?: string;
    };
    notes?: string;
  };
  items: { menuItemId: string; quantity: number }[];
  bonus?: "rice" | "naan" | "none";
  voucherCode?: string;
  membershipId?: string;
  paymentMethod: "cod" | "stripe";
}) {
  // Load menu items (must exist + available)
  const ids = input.items.map((i) => i.menuItemId);
  const menuItems = await MenuItemModel.find({ _id: { $in: ids } }).lean();

  if (menuItems.length !== ids.length)
    throw new ApiError(400, "One or more menu items not found");

  const byId = new Map(menuItems.map((m) => [String(m._id), m]));

  // Build order items snapshot + compute subtotal
  let subtotal = 0;
  const itemsSnapshot = input.items.map((i) => {
    const m = byId.get(i.menuItemId);
    if (!m) throw new ApiError(400, "Menu item not found");
    if (!m.available)
      throw new ApiError(400, "One or more items are unavailable");

    const line = m.price.amount * i.quantity;
    subtotal += line;

    return {
      menuItemId: m._id,
      nameSnapshot: m.name,
      unitPrice: m.price,
      quantity: i.quantity,
      isMainDish: !!m.isMainDish,
      vegetarian: !!m.vegetarian,
      vegan: !!m.vegan,
      glutenFree: !!m.glutenFree,
      spicy: !!m.spicy,
      nuts: !!m.nuts,
    };
  });

  // BONUS RULE: only if ALL items are main dish
  const allMainDish = itemsSnapshot.every((x) => x.isMainDish);
  const requestedBonus = input.bonus ?? "none";
  const bonusFinal: "rice" | "naan" | "none" = allMainDish
    ? requestedBonus
    : "none";

  const bonusPrice = money(0, "EUR"); // always free when eligible

  // Discounts (placeholder logic = 0 for now)
  // You’ll implement validateVoucher/membership later and compute discountTotal.
  let voucherDiscount = 0;
  let membershipDiscount = 0;

  if (input.voucherCode && input.voucherCode.trim()) {
    const v = await validateVoucher({
      code: input.voucherCode.trim(),
      subtotalAmount: subtotal,
      currency: "EUR",
    });
    voucherDiscount = v.discountAmount;
  }

  if (input.membershipId && input.membershipId.trim()) {
    const m = await validateMembership({
      membershipId: input.membershipId.trim(),
      subtotalAmount: subtotal,
    });
    membershipDiscount = m.discountAmount;
  }

  let discountAmount = voucherDiscount + membershipDiscount;
  discountAmount = Math.min(discountAmount, subtotal);

  const discountTotal = money(0, "EUR");

  const total = Math.max(
    0,
    subtotal - discountTotal.amount + bonusPrice.amount
  );

  const orderNumber = genOrderNumber();

  const order = await OrderModel.create({
    orderNumber,
    customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email ?? "",
    },
    fulfillment: {
      type: input.fulfillment.type,
      address: {
        line1: input.fulfillment.address?.line1 ?? "",
        postalCode: input.fulfillment.address?.postalCode ?? "",
        city: input.fulfillment.address?.city ?? "",
        country: input.fulfillment.address?.country ?? "NL",
      },
      notes: input.fulfillment.notes ?? "",
    },
    items: itemsSnapshot,
    bonus: { type: bonusFinal, price: bonusPrice },
    discounts: {
      voucherCode: input.voucherCode ?? "",
      membershipId: input.membershipId ?? "",
      discountTotal,
    },
    totals: {
      subtotal: money(subtotal, "EUR"),
      total: money(total, "EUR"),
    },
    payment: {
      method: input.paymentMethod,
      status: input.paymentMethod === "cod" ? "pending" : "pending",
      stripeSessionId: "",
    },
    status: "new",
  });

  // Emit Pusher event for admin
  if (pusher) {
    await pusher.trigger("private-admin", "order:new", {
      id: String(order._id),
      orderNumber: order.orderNumber,
      total: order.totals.total,
      createdAt: order.createdAt,
      fulfillmentType: order.fulfillment.type,
    });
  }

  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    paymentMethod: order.payment.method,
    total: order.totals.total,
    allMainDishEligible: allMainDish,
    bonusApplied: bonusFinal,
  };
}

export async function getOrderById(id: string) {
  const order = await OrderModel.findById(id).lean();
  if (!order) throw new ApiError(404, "Order not found");

  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    status: order.status,
    customer: order.customer,
    fulfillment: order.fulfillment,
    items: order.items,
    bonus: order.bonus,
    discounts: order.discounts,
    totals: order.totals,
    payment: {
      method: order.payment.method,
      status: order.payment.status,
    },
    createdAt: order.createdAt,
  };
}
