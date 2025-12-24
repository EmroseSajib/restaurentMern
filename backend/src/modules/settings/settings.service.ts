import { SettingsModel } from "../../models/Settings.model";

function defaultDay() {
  return { isClosed: false, ranges: [{ start: "11:00", end: "22:00" }] };
}

function defaultWeek() {
  return {
    mon: defaultDay(),
    tue: defaultDay(),
    wed: defaultDay(),
    thu: defaultDay(),
    fri: defaultDay(),
    sat: defaultDay(),
    sun: defaultDay(),
  };
}

export async function getPublicSettings() {
  let s = await SettingsModel.findOne({ key: "global" }).lean();

  // create once if missing (no TODOs; we self-heal)
  if (!s) {
    const created = await SettingsModel.create({
      key: "global",
      restaurant: {
        name: "dekleineman",
        cuisine: "Indian Restaurant",
        address: "Heezenstraat 24, 7001BR Doetinchem, Netherlands",
        phone: "+31 6 87 94 73 71",
        country: "NL",
      },
      fulfillment: {
        deliveryEnabled: true,
        pickupEnabled: true,
        minOrderAmount: 0,
      },
      openingHours: defaultWeek(),
      deliveryHours: defaultWeek(),
    });

    s = created.toObject();
  }

  return {
    restaurant: s.restaurant,
    fulfillment: s.fulfillment,
    openingHours: s.openingHours,
    deliveryHours: s.deliveryHours,
    updatedAt: s.updatedAt,
  };
}

export async function adminUpdateSettings(input: any) {
  const updated = await SettingsModel.findOneAndUpdate(
    { key: "global" },
    { $set: input, $setOnInsert: { key: "global" } },
    { new: true, upsert: true }
  ).lean();

  return {
    restaurant: updated!.restaurant,
    fulfillment: updated!.fulfillment,
    openingHours: updated!.openingHours,
    deliveryHours: updated!.deliveryHours,
    updatedAt: updated!.updatedAt,
  };
}
