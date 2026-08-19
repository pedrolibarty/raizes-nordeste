import express from "express";
import { AppError } from "./errors/appError.js";
import handleErrorMiddleware from "./middlewares/handleError.middleware.js";
import branchRoutes from "./routes/branches.routes.js";
import userRoutes from "./routes/users.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (request, response) => {
  return response.status(200).json({
    status: "ok",
    message: "API is running.",
  });
});

app.use("/branches", branchRoutes);
app.use("/users", userRoutes);

app.use((request, response, next) => {
  return next(new AppError("Rota não encontrada.", 404));
});

app.use(handleErrorMiddleware);
