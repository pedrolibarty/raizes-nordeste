import { EntitySchema } from "typeorm";

export const Product = new EntitySchema({
  name: "Product",
  tableName: "products",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    productCode: {
      name: "product_code",
      type: "integer",
      nullable: false,
    },

    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    category: {
      type: "varchar",
      length: 30,
      nullable: false,
    },

    isAvailable: {
      name: "is_available",
      type: "boolean",
      nullable: false,
      default: true,
    },

    isActive: {
      name: "is_active",
      type: "boolean",
      nullable: false,
      default: true,
    },

    price: {
      type: "numeric",
      precision: 10,
      scale: 2,
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
    branch: {
      type: "many-to-one",
      target: "Branch",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "branch_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_products_branch",
      },
    },
  },

  uniques: [
    {
      name: "uq_products_code_branch",
      columns: ["productCode", "branch"],
    },
  ],

  checks: [
    {
      name: "chk_products_code_positive",
      expression: `"product_code" > 0`,
    },
    {
      name: "chk_products_price_non_negative",
      expression: `"price" >= 0`,
    },
  ],
});