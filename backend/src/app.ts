import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";

import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Bienvenido a la API del sistema CRUD + Login",
  });
});

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "API funcionando correctamente",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Siempre debe ir después de todas las rutas.
app.use(errorHandler);

export default app;