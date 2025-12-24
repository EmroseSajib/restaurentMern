import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function bootstrap() {
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () =>
    console.log(`🚀 API running on http://localhost:${env.PORT}`)
  );
}

bootstrap().catch((e) => {
  console.error("❌ Failed to start server", e);
  process.exit(1);
});
