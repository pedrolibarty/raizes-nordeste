import { EntitySchema } from "typeorm";
import { USER_ROLE_VALUES } from "./user.roles.js";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },

    role: {
      type: "varchar",
      length: 20,
      nullable: false,
    },

    email: {
      type: "varchar",
      length: 150,
      nullable: false,
      unique: true,
    },

    password: {
      type: "varchar",
      length: 255,
      nullable: false,
      select: false,
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
    branch: {
      type: "many-to-one",
      target: "Branch",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "branch_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_users_branch",
      },
    },
  },

  checks: [
    {
      name: "chk_users_role",
      expression: `"role" IN (${USER_ROLE_VALUES.map(
        (role) => `'${role}'`,
      ).join(", ")})`,
    },
  ],
});
