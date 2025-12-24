import { OrderModel } from "../../models/Order.model";
import { ApiError } from "../../utils/apiError";

export async function adminListOrders(query: {
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  from?: string;
  to?: string;
  q?: string;
  page: number;
  limit: number;
}) {
  const filter: any = {};

  if (query.status) filter.status = query.status;
  if (query.paymentMethod) filter["payment.method"] = query.paymentMethod;
  if (query.paymentStatus) filter["payment.status"] = query.paymentStatus;

  if (query.q) {
    filter.orderNumber = { $regex: query.q.trim(), $options: "i" };
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        orderNumber: 1,
        status: 1,
        createdAt: 1,
        "customer.name": 1,
        "customer.phone": 1,
        "fulfillment.type": 1,
        "totals.total": 1,
        "payment.method": 1,
        "payment.status": 1,
      })
      .lean(),
    OrderModel.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    items: items.map((o) => ({
      id: String(o._id),
      orderNumber: o.orderNumber,
      status: o.status,
      createdAt: o.createdAt,
      customer: o.customer,
      fulfillment: o.fulfillment,
      totals: o.totals,
      payment: o.payment,
    })),
  };
}

export async function adminGetOrder(id: string) {
  const o = await OrderModel.findById(id).lean();
  if (!o) throw new ApiError(404, "Order not found");

  return {
    id: String(o._id),
    orderNumber: o.orderNumber,
    status: o.status,
    customer: o.customer,
    fulfillment: o.fulfillment,
    items: o.items,
    bonus: o.bonus,
    discounts: o.discounts,
    totals: o.totals,
    payment: {
      method: o.payment.method,
      status: o.payment.status,
      stripeSessionId: o.payment.stripeSessionId ? "present" : "",
    },
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  const updated = await OrderModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  ).lean();
  if (!updated) throw new ApiError(404, "Order not found");

  return {
    id: String(updated._id),
    status: updated.status,
    orderNumber: updated.orderNumber,
  };
}
