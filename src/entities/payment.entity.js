import { EntitySchema } from "typeorm";
import { PAYMENT_STATUS_VALUES } from "../constants/payment-statuses.js";

export const Payment = new EntitySchema({
  name: "Payment",
  tableName: "payments",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    paymentMethod: {
      name: "payment_method",
      type: "varchar",
      length: 20,
      nullable: false,
    },

    status: {
      type: "char",
      length: 1,
      nullable: false,
    },

    valAmount: {
      name: "val_amount",
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
    },

    externalTransactionId: {
      name: "external_transaction_id",
      type: "varchar",
      length: 100,
      nullable: true,
    },

    requestPayload: {
      name: "request_payload",
      type: "jsonb",
      nullable: false,
    },

    responsePayload: {
      name: "response_payload",
      type: "jsonb",
      nullable: true,
    },

    failureReason: {
      name: "failure_reason",
      type: "varchar",
      length: 255,
      nullable: true,
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

    paidAt: {
      name: "paid_at",
      type: "timestamp",
      nullable: true,
    },
  },

  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "order_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_payments_order",
      },
    },
  },

  checks: [
    {
      name: "chk_payments_status",
      expression: `"status" IN (${PAYMENT_STATUS_VALUES.map(
        (status) => `'${status}'`
      ).join(", ")})`,
    },

    {
      name: "chk_payments_amount_positive",
      expression: `"val_amount" > 0`,
    },
  ],
});