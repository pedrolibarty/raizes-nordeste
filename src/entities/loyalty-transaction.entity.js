import { EntitySchema } from "typeorm";
import { LOYALTY_TRANSACTION_TYPE_VALUES } from "../constants/loyalty-transaction-types.js";

export const LoyaltyTransaction = new EntitySchema({
  name: "LoyaltyTransaction",
  tableName: "loyalty_transactions",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    transactionType: {
      name: "transaction_type",
      type: "char",
      length: 1,
      nullable: false,
    },

    description: {
      type: "varchar",
      length: 255,
      nullable: true,
    },

    points: {
      type: "integer",
      nullable: false,
    },

    createdAt: {
      name: "created_at",
      type: "timestamp",
      nullable: false,
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },

    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      nullable: false,
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },

  relations: {
    loyaltyAccount: {
      type: "many-to-one",
      target: "LoyaltyAccount",
      nullable: false,
      onDelete: "RESTRICT",
      joinColumn: {
        name: "loyalty_account_id",
        referencedColumnName: "id",
        foreignKeyConstraintName:
          "fk_loyalty_transactions_loyalty_account",
      },
    },

    order: {
      type: "many-to-one",
      target: "Order",
      nullable: true,
      onDelete: "RESTRICT",
      joinColumn: {
        name: "order_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_loyalty_transactions_order",
      },
    },
  },

  checks: [
    {
      name: "chk_loyalty_transactions_type",
      expression: `"transaction_type" IN (${LOYALTY_TRANSACTION_TYPE_VALUES.map(
        (type) => `'${type}'`,
      ).join(", ")})`,
    },
    {
      name: "chk_loyalsó queroty_transactions_points",
      expression: `"points" > 0`,
    },
  ],
});