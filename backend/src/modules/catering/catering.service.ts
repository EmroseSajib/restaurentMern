import { pusher } from "../../config/pusher";
import { CateringRequestModel } from "../../models/CateringRequest.model";
import { ApiError } from "../../utils/apiError";

export async function createCateringRequest(input: {
  customer: { name: string; phone: string; email?: string; company?: string };
  event: {
    date: string;
    peopleCount: number;
    location?: string;
    occasion?: string;
  };
  preferences?: { dietaryNotes?: string; budgetRange?: string };
  message?: string;
}) {
  const when = new Date(input.event.date);
  if (Number.isNaN(when.getTime()))
    throw new ApiError(400, "Invalid event date");

  // sanity: at least ~1 hour in future
  if (when.getTime() < Date.now() + 60 * 60 * 1000) {
    throw new ApiError(400, "Event date must be in the future");
  }

  const created = await CateringRequestModel.create({
    customer: {
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email ?? "",
      company: input.customer.company ?? "",
    },
    event: {
      date: when,
      peopleCount: input.event.peopleCount,
      location: input.event.location ?? "",
      occasion: input.event.occasion ?? "",
    },
    preferences: {
      dietaryNotes: input.preferences?.dietaryNotes ?? "",
      budgetRange: input.preferences?.budgetRange ?? "",
    },
    message: input.message ?? "",
    status: "new",
    source: "web",
  });

  if (pusher) {
    await pusher.trigger("private-admin", "catering:new", {
      id: String(created._id),
      date: created.event.date,
      peopleCount: created.event.peopleCount,
      name: created.customer.name,
      phone: created.customer.phone,
      createdAt: created.createdAt,
      status: created.status,
    });
  }

  return {
    id: String(created._id),
    status: created.status,
    eventDate: created.event.date,
  };
}

export async function adminListCateringRequests(query: {
  status?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}) {
  const filter: any = {};
  if (query.status) filter.status = query.status;

  if (query.from || query.to) {
    filter["event.date"] = {};
    if (query.from) filter["event.date"].$gte = new Date(query.from);
    if (query.to) filter["event.date"].$lte = new Date(query.to);
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    CateringRequestModel.find(filter)
      .sort({ "event.date": 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CateringRequestModel.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    items: items.map((c) => ({
      id: String(c._id),
      customer: c.customer,
      event: c.event,
      preferences: c.preferences,
      message: c.message,
      status: c.status,
      createdAt: c.createdAt,
    })),
  };
}

export async function adminUpdateCateringStatus(id: string, status: string) {
  const updated = await CateringRequestModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  ).lean();

  if (!updated) throw new ApiError(404, "Catering request not found");

  return {
    id: String(updated._id),
    status: updated.status,
    eventDate: updated.event.date,
  };
}
