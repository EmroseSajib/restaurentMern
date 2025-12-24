import bcrypt from "bcrypt";
import { connectDB } from "../config/db";
import { AdminModel } from "../models/Admin.model";

async function run() {
  await connectDB();

  const username = "emrosesajib";
  const password = "786_S@Jib";

  const exists = await AdminModel.findOne({ username });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminModel.create({ username, passwordHash, role: "admin" });

  console.log("✅ Admin created:", { username, password });
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
