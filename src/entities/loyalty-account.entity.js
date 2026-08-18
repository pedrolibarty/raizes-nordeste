import { EntitySchema } from "typeorm";

export const LoyaltyAccount = new EntitySchema({
  name: "LoyaltyAccount",
  tableName: "loyalty_accounts",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },

    hasConsent: {
      name: "has_consent",
      type: "boolean",
      nullable: false,
      default: false,
    },

    consentedAt: {
      name: "consented_at",
      type: "timestamp",
      nullable: true,
    },

    pointsBalance: {
      name: "points_balance",
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
  },

  relations: {
    client: {
      type: "one-to-one",
      target: "Client",
      nullable: false,
      onDelete: "RESTRICT",

      joinColumn: {
        name: "client_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_loyalty_accounts_client",
      },
    },
  },

  checks: [
    {
      name: "chk_loyalty_accounts_balance",
      expression: `"points_balance" >= 0`,
    },
    {
      name: "chk_loyalty_accounts_consent",
      expression: `(
        ("has_consent" = FALSE AND "consented_at" IS NULL)
        OR
        ("has_consent" = TRUE AND "consented_at" IS NOT NULL)
      )`,
    },
  ],
});