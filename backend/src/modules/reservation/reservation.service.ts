import { pusher } from "../../config/pusher";
import { ReservationModel } from "../../models/Reservation.model";
import { ApiError } from "../../utils/apiError";

export async function createReservation(input: {
  customer: { name: string; phone: string; email?: string };
  partySize: number;
  reservationAt: string; // ISO
  notes?: string;
}) {
  const when = new Date(input.reservationAt);
  if (Number.isNaN(when.getTime()))
    throw new ApiError(400, "Invalid reservation time");

  // basic sanity: no past reservations
  if (when.getTime() < Date.now() - 60_000)
    throw new ApiError(400, "Reservation time is in the past");

  const created = await ReservationModel.create({
    customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email ?? "",
    },
    partySize: input.partySize,
    reservationAt: when,
    notes: input.notes ?? "",
    status: "new",
    source: "web",
  });

  // realtime notify admins
  if (pusher) {
    await pusher.trigger("private-admin", "reservation:new", {
      id: String(created._id),
      reservationAt: created.reservationAt,
      partySize: created.partySize,
      name: created.customer.name,
      phone: created.customer.phone,
      createdAt: created.createdAt,
      status: created.status,
    });
  }

  return {
    id: String(created._id),
    status: created.status,
    reservationAt: created.reservationAt,
  };
}

export async function adminListReservations(query: {
  status?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}) {
  const filter: any = {};

  if (query.status) filter.status = query.status;

  if (query.from || query.to) {
    filter.reservationAt = {};
    if (query.from) filter.reservationAt.$gte = new Date(query.from);
    if (query.to) filter.reservationAt.$lte = new Date(query.to);
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ReservationModel.find(filter)
      .sort({ reservationAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ReservationModel.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    items: items.map((r) => ({
      id: String(r._id),
      customer: r.customer,
      partySize: r.partySize,
      reservationAt: r.reservationAt,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt,
    })),
  };
}

export async function adminUpdateReservationStatus(id: string, status: string) {
  const updated = await ReservationModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  ).lean();

  if (!updated) throw new ApiError(404, "Reservation not found");

  return {
    id: String(updated._id),
    status: updated.status,
    reservationAt: updated.reservationAt,
  };
}
