import { EntitySchema } from "typeorm";

export const Promotion = new EntitySchema({
  name: "Promotion",
  tableName: "promotions",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    description: {
      name: "des_promotion",
      type: "varchar",
      length: 255,
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

    extraPoints: {
      name: "extra_points",
      type: "integer",
      nullable: false,
      default: 0,
    },

    isActive: {
      name: "is_active",
      type: "boolean",
      nullable: false,
      default: true,
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
    user: {
      type: "many-to-one",
      target: "User",
      nullable: false,
      onDelete: "RESTRICT",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_promotions_user",
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
        foreignKeyConstraintName: "fk_promotions_product",
      },
    },
  },

  checks: [
    {
      name: "chk_promotions_discount",
      expression: `"val_discount" >= 0`,
    },
    {
      name: "chk_promotions_extra_points",
      expression: `"extra_points" >= 0`,
    },
  ],

  indices: [
    {
      name: "uq_promotions_active_product",
      columns: ["product"],
      unique: true,
      where: '"is_active" = TRUE',
    },
  ],
});
