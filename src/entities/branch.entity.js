import { EntitySchema } from "typeorm";

export const Branch = new EntitySchema({
  name: "Branch",
  tableName: "branches",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    branchCode: {
      name: "branch_code",
      type: "integer",
      nullable: false,
      unique: true,
    },

    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    openingRules: {
      name: "opening_rules",
      type: "jsonb",
      nullable: false,
    },

    street: {
      type: "varchar",
      length: 150,
      nullable: false,
    },

    district: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    city: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    state: {
      type: "char",
      length: 2,
      nullable: false,
    },

    number: {
      type: "varchar",
      length: 20,
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

  checks: [
    {
      name: "chk_branches_code_positive",
      expression: `"branch_code" > 0`,
    },
    {
      name: "chk_branches_state",
      expression: `"state" ~ '^[A-Z]{2}$'`,
    },
  ],
});