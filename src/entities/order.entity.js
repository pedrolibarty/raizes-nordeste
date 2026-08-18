import { EntitySchema } from "typeorm";

export const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    orderChannel: {
      name: "order_channel",
      type: "varchar",
      length: 20,
      nullable: false,
    },

    status: {
      type: "char",
      length: 1,
      nullable: false,
    },

    valAmountOg: {
      name: "val_amount_og",
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
      default: 0,
    },

    valDiscount: {
      name: "val_discount",
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
      default: 0,
    },

    valAmount: {
      name: "val_amount",
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
      default: 0,
    },

    points: {
      type: "integer",
      nullable: false,
      default: 0,
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

    cancelledAt: {
      name: "cancelled_at",
      type: "timestamp",
      nullable: true,
    },
  },

  relations: {
    client: {
      type: "many-to-one",
      target: "Client",
      nullable: true,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "client_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_orders_client",
      },
    },

    user: {
      type: "many-to-one",
      target: "User",
      nullable: true,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_orders_user",
      },
    },

    branch: {
      type: "many-to-one",
      target: "Branch",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "branch_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_orders_branch",
      },
    },
  },

  checks: [
    {
      name: "chk_orders_channel",
      expression: `"order_channel" IN (
        'APP',
        'TOTEM',
        'BALCAO',
        'PICKUP',
        'WEB'
      )`,
    },
    {
      name: "chk_orders_original_amount",
      expression: `"val_amount_og" >= 0`,
    },
    {
      name: "chk_orders_discount",
      expression: `"val_discount" >= 0 AND "val_discount" <= "val_amount_og"`,
    },
    {
      name: "chk_orders_final_amount",
      expression: `"val_amount" >= 0`,
    },
    {
      name: "chk_orders_points",
      expression: `"points" >= 0`,
    },
  ],
});