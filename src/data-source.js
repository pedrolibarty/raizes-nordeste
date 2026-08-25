import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { AuditLog } from "./entities/audit-log.entity.js";
import { Branch } from "./entities/branch.entity.js";
import { Client } from "./entities/client.entity.js";
import { Inventory } from "./entities/inventory.entity.js";
import { LoyaltyAccount } from "./entities/loyalty-account.entity.js";
import { LoyaltyTransaction } from "./entities/loyalty-transaction.entity.js";
import { Movement } from "./entities/movement.entity.js";
import { OrderItem } from "./entities/order-item.entity.js";
import { Order } from "./entities/order.entity.js";
import { Payment } from "./entities/payment.entity.js";
import { Product } from "./entities/product.entity.js";
import { Promotion } from "./entities/promotion.entity.js";
import { User } from "./entities/user.entity.js";
import { CreateInitialTables1787144665850 } from "./migrations/1787144665850-CreateInitialTables.js";
import { AddNotesToMovements1787518063893 } from "./migrations/1787518063893-AddNotesToMovements.js";
import { UpdateLoyaltyTransactionTypes1787538544129 } from "./migrations/1787538544129-UpdateLoyaltyTransactionTypes.js";
import { AddUniqueActivePromotionByProduct1787539000000 } from "./migrations/1787539000000-AddUniqueActivePromotionByProduct.js";
import { RemoveDeclinedOrderStatus1787540000000 } from "./migrations/1787540000000-RemoveDeclinedOrderStatus.js";
import { CreateAuditLogs1787541000000 } from "./migrations/1787541000000-CreateAuditLogs.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [
    AuditLog,
    Branch,
    Client,
    Inventory,
    LoyaltyAccount,
    LoyaltyTransaction,
    Movement,
    Order,
    OrderItem,
    Payment,
    Product,
    Promotion,
    User,
  ],
  migrations: [
    CreateInitialTables1787144665850,
    AddNotesToMovements1787518063893,
    UpdateLoyaltyTransactionTypes1787538544129,
    AddUniqueActivePromotionByProduct1787539000000,
    RemoveDeclinedOrderStatus1787540000000,
    CreateAuditLogs1787541000000,
  ],

  synchronize: false,
  logging: false,
});
