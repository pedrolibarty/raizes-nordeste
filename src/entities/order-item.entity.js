import { EntitySchema } from "typeorm";

export const OrderItem = new EntitySchema({
  name: "OrderItem",
  tableName: "order_items",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    quantity: {
      type: "integer",
      nullable: false,
    },

    status: {
      type: "varchar",
      length: 20,
      nullable: false,
    },

    valUniAmountOg: {
      name: "val_uni_amount_og",
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
    },

    valAmountOg: {
      name: "val_amount_og",
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
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
    },

    notes: {
      type: "text",
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

    cancelledAt: {
      name: "cancelled_at",
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
        foreignKeyConstraintName: "fk_order_items_order",
      },
    },

    product: {
      type: "many-to-one",
      target: "Product",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "product_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_order_items_product",
      },
    },
  },

  checks: [
    {
      name: "chk_order_items_quantity",
      expression: `"quantity" > 0`,
    },
    {
      name: "chk_order_items_unit_amount",
      expression: `"val_uni_amount_og" >= 0`,
    },
    {
      name: "chk_order_items_original_amount",
      expression: `"val_amount_og" >= 0`,
    },
    {
      name: "chk_order_items_discount",
      expression: `"val_discount" >= 0 AND "val_discount" <= "val_amount_og"`,
    },
    {
      name: "chk_order_items_final_amount",
      expression: `"val_amount" >= 0`,
    },
  ],
});