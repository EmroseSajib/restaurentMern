import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import giftVouchersRoutes from "./modules/giftVouchers/giftVouchers.routes";
import routes from "./routes";
export function createApp() {
  const app = express();
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://restaurent-mern.vercel.app",
    // add your deployed frontend domain too later
  ];

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // allow Postman / server-to-server calls with no Origin header
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use("/v1/gift-vouchers", giftVouchersRoutes);

  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(cookieParser());

  app.get("/health", (_req, res) =>
    res.json({ ok: true, name: "dekleineman-api" }),
  );

  app.use("/v1", routes);

  app.use(errorMiddleware);
  return app;
}
