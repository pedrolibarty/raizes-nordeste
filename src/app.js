import express from "express";
import { AppError } from "./errors/appError.js";
import handleErrorMiddleware from "./middlewares/handleError.middleware.js";
import branchRoutes from "./routes/branches.routes.js";
import clientRoutes from "./routes/clients.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import loyaltyAccountRoutes from "./routes/loyaltyAccounts.routes.js";
import loyaltyTransactionRoutes from "./routes/loyaltyTransactions.routes.js";
import movementRoutes from "./routes/movements.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import productRoutes from "./routes/products.routes.js";
import promotionRoutes from "./routes/promotions.routes.js";
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
app.use("/clients", clientRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/loyalty-accounts", loyaltyAccountRoutes);
app.use("/loyalty-transactions", loyaltyTransactionRoutes);
app.use("/movements", movementRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/products", productRoutes);
app.use("/promotions", promotionRoutes);
app.use("/users", userRoutes);

app.use((request, response, next) => {
  return next(new AppError("Rota não encontrada.", 404));
});

app.use(handleErrorMiddleware);
