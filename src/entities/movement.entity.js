import { EntitySchema } from "typeorm";
import { MOVEMENT_TYPE_VALUES } from "../constants/movement-types.js";

export const Movement = new EntitySchema({
  name: "Movement",
  tableName: "movements",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    movementType: {
      name: "movement_type",
      type: "char",
      length: 1,
      nullable: false,
    },

    quantity: {
      type: "integer",
      nullable: false,
    },

    notes: {
      type: "varchar",
      length: 255,
      nullable: false,
    },

    createdAt: {
      name: "created_at",
      type: "timestamp",
      nullable: false,
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },

  relations: {
    inventory: {
      type: "many-to-one",
      target: "Inventory",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "inventory_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_movements_inventory",
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
        foreignKeyConstraintName: "fk_movements_user",
      },
    },
  },

  checks: [
    {
      name: "chk_movements_type",
      expression: `"movement_type" IN (${MOVEMENT_TYPE_VALUES.map(
        (type) => `'${type}'`,
      ).join(", ")})`,
    },
    {
      name: "chk_movements_quantity_positive",
      expression: `"quantity" > 0`,
    },
  ],
});
