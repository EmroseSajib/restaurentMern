import { CateringRequestModel } from "../../models/CateringRequest.model";
import { OrderModel } from "../../models/Order.model";
import { ReservationModel } from "../../models/Reservation.model";

function startOfDayUTC(d = new Date()) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)
  );
}
function addDaysUTC(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export async function getDashboardStats() {
  const todayStart = startOfDayUTC();
  const tomorrowStart = addDaysUTC(todayStart, 1);

  const [ordersToday, revenueAgg, reservationsToday, cateringToday] =
    await Promise.all([
      OrderModel.countDocuments({
        createdAt: { $gte: todayStart, $lt: tomorrowStart },
      }),
      OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: todayStart, $lt: tomorrowStart },
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$totals.total.amount" } } },
      ]),
      ReservationModel.countDocuments({
        createdAt: { $gte: todayStart, $lt: tomorrowStart },
      }),
      CateringRequestModel.countDocuments({
        createdAt: { $gte: todayStart, $lt: tomorrowStart },
      }),
    ]);

  const revenueToday = revenueAgg?.[0]?.total ?? 0;

  // last 7 days chart
  const from = addDaysUTC(todayStart, -6);
  const to = addDaysUTC(tomorrowStart, 0);

  const [revByDay, ordersByDay] = await Promise.all([
    OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lt: to },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totals.total.amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    OrderModel.aggregate([
      { $match: { createdAt: { $gte: from, $lt: to } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const revenueByDay = revByDay.map((x) => ({ date: x._id, amount: x.total }));
  const ordersSeries = ordersByDay.map((x) => ({
    date: x._id,
    count: x.count,
  }));

  // latest items
  const [latestOrders, latestReservations, latestCatering] = await Promise.all([
    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select({
        orderNumber: 1,
        status: 1,
        createdAt: 1,
        "customer.name": 1,
        "fulfillment.type": 1,
        "totals.total": 1,
        "payment.method": 1,
        "payment.status": 1,
      })
      .lean(),
    ReservationModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select({
        customer: 1,
        partySize: 1,
        reservationAt: 1,
        status: 1,
        createdAt: 1,
      })
      .lean(),
    CateringRequestModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select({
        customer: 1,
        event: 1,
        status: 1,
        createdAt: 1,
      })
      .lean(),
  ]);

  return {
    kpis: {
      revenueToday,
      ordersToday,
      reservationsToday,
      cateringToday,
    },
    charts: {
      revenueByDay,
      ordersByDay: ordersSeries,
    },
    latest: {
      orders: latestOrders.map((o) => ({
        id: String(o._id),
        orderNumber: o.orderNumber,
        status: o.status,
        createdAt: o.createdAt,
        customer: o.customer,
        fulfillment: o.fulfillment,
        totals: o.totals,
        payment: o.payment,
      })),
      reservations: latestReservations.map((r) => ({
        id: String(r._id),
        createdAt: r.createdAt,
        reservationAt: r.reservationAt,
        partySize: r.partySize,
        status: r.status,
        customer: r.customer,
      })),
      catering: latestCatering.map((c) => ({
        id: String(c._id),
        createdAt: c.createdAt,
        status: c.status,
        customer: c.customer,
        event: c.event,
      })),
    },
  };
}
