import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import routes from "./routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.post("/v1/webhooks/stripe", express.raw({ type: "application/json" }));

  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(cookieParser());

  app.get("/health", (_req, res) =>
    res.json({ ok: true, name: "dekleineman-api" })
  );

  app.use("/v1", routes);

  app.use(errorMiddleware);
  return app;
}
