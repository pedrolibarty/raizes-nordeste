import { EntitySchema } from "typeorm";

export const Client = new EntitySchema({
  name: "Client",
  tableName: "clients",

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

    cpf: {
      type: "char",
      length: 11,
      nullable: false,
      unique: true,
    },

    contact: {
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
      name: "chk_clients_cpf",
      expression: `"cpf" ~ '^[0-9]{11}$'`,
    },
    {
      name: "chk_clients_state",
      expression: `"state" ~ '^[A-Z]{2}$'`,
    },
  ],
});