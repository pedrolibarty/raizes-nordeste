import { EntitySchema } from "typeorm";

export const Inventory = new EntitySchema({
  name: "Inventory",
  tableName: "inventory",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    quantity: {
      type: "integer",
      nullable: false,
      default: 0,
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
    product: {
      type: "one-to-one",
      target: "Product",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "product_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_inventory_product",
      },
    },
  },

  checks: [
    {
      name: "chk_inventory_quantity_non_negative",
      expression: `"quantity" >= 0`,
    },
  ],
});