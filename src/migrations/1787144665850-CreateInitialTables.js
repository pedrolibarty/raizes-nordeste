/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class CreateInitialTables1787144665850 {
    name = 'CreateInitialTables1787144665850'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "branch_code" integer NOT NULL, "name" character varying(100) NOT NULL, "opening_rules" jsonb NOT NULL, "street" character varying(150) NOT NULL, "district" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "state" character(2) NOT NULL, "number" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7b48a680eb17f642cc36ff78d8f" UNIQUE ("branch_code"), CONSTRAINT "chk_branches_code_positive" CHECK ("branch_code" > 0), CONSTRAINT "chk_branches_state" CHECK ("state" ~ '^[A-Z]{2}$'), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "cpf" character(11) NOT NULL, "contact" character varying(20) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "street" character varying(150) NOT NULL, "district" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "state" character(2) NOT NULL, "number" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4245ac34add1ceeb505efc98777" UNIQUE ("cpf"), CONSTRAINT "UQ_b48860677afe62cd96e12659482" UNIQUE ("email"), CONSTRAINT "chk_clients_cpf" CHECK ("cpf" ~ '^[0-9]{11}$'), CONSTRAINT "chk_clients_state" CHECK ("state" ~ '^[A-Z]{2}$'), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, CONSTRAINT "REL_732fdb1f76432d65d2c136340d" UNIQUE ("product_id"), CONSTRAINT "chk_inventory_quantity_non_negative" CHECK ("quantity" >= 0), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loyalty_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "has_consent" boolean NOT NULL DEFAULT false, "consented_at" TIMESTAMP, "points_balance" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" uuid NOT NULL, CONSTRAINT "REL_b7cf0568e40ce5d91e69fea08f" UNIQUE ("client_id"), CONSTRAINT "chk_loyalty_accounts_balance" CHECK ("points_balance" >= 0), CONSTRAINT "chk_loyalty_accounts_consent" CHECK ((
        ("has_consent" = FALSE AND "consented_at" IS NULL)
        OR
        ("has_consent" = TRUE AND "consented_at" IS NOT NULL)
      )), CONSTRAINT "PK_115c58d47255c4ea7da5d6f8cf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loyalty_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_type" character(1) NOT NULL, "description" character varying(255), "points" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "loyalty_account_id" uuid NOT NULL, "order_id" uuid, CONSTRAINT "chk_loyalty_transactions_type" CHECK ("transaction_type" IN ('E', 'R', 'A', 'X', 'V')), CONSTRAINT "chk_loyalsó queroty_transactions_points" CHECK ("points" > 0), CONSTRAINT "PK_df453f678b7575221b335673362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "movement_type" character(1) NOT NULL, "quantity" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "inventory_id" uuid NOT NULL, "user_id" uuid, CONSTRAINT "chk_movements_type" CHECK ("movement_type" IN ('E', 'S', 'A', 'R')), CONSTRAINT "chk_movements_quantity_positive" CHECK ("quantity" > 0), CONSTRAINT "PK_5a8e3da15ab8f2ce353e7f58f67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "status" character varying(20) NOT NULL, "val_uni_amount_og" numeric(10,2) NOT NULL, "val_amount_og" numeric(10,2) NOT NULL, "val_discount" numeric(10,2) NOT NULL DEFAULT '0', "val_amount" numeric(10,2) NOT NULL, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cancelled_at" TIMESTAMP, "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "chk_order_items_quantity" CHECK ("quantity" > 0), CONSTRAINT "chk_order_items_unit_amount" CHECK ("val_uni_amount_og" >= 0), CONSTRAINT "chk_order_items_original_amount" CHECK ("val_amount_og" >= 0), CONSTRAINT "chk_order_items_discount" CHECK ("val_discount" >= 0 AND "val_discount" <= "val_amount_og"), CONSTRAINT "chk_order_items_final_amount" CHECK ("val_amount" >= 0), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_channel" character varying(20) NOT NULL, "status" character(1) NOT NULL, "val_amount_og" numeric(10,2) NOT NULL DEFAULT '0', "val_discount" numeric(10,2) NOT NULL DEFAULT '0', "val_amount" numeric(10,2) NOT NULL DEFAULT '0', "points" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cancelled_at" TIMESTAMP, "client_id" uuid, "user_id" uuid, "branch_id" uuid NOT NULL, CONSTRAINT "chk_orders_channel" CHECK ("order_channel" IN (
        'APP',
        'TOTEM',
        'BALCAO',
        'PICKUP',
        'WEB'
      )), CONSTRAINT "chk_orders_status" CHECK ("status" IN ('A', 'P', 'C', 'R', 'E', 'X', 'N')), CONSTRAINT "chk_orders_original_amount" CHECK ("val_amount_og" >= 0), CONSTRAINT "chk_orders_discount" CHECK (
        "val_discount" >= 0
        AND "val_discount" <= "val_amount_og"
      ), CONSTRAINT "chk_orders_final_amount" CHECK ("val_amount" >= 0), CONSTRAINT "chk_orders_points" CHECK ("points" >= 0), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_method" character varying(20) NOT NULL, "status" character(1) NOT NULL, "val_amount" numeric(10,2) NOT NULL, "external_transaction_id" character varying(100), "request_payload" jsonb NOT NULL, "response_payload" jsonb, "failure_reason" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "paid_at" TIMESTAMP, "order_id" uuid NOT NULL, CONSTRAINT "chk_payments_status" CHECK ("status" IN ('P', 'A', 'N', 'E', 'C', 'R')), CONSTRAINT "chk_payments_amount_positive" CHECK ("val_amount" > 0), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_code" integer NOT NULL, "name" character varying(100) NOT NULL, "category" character varying(30) NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "is_active" boolean NOT NULL DEFAULT true, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" uuid NOT NULL, CONSTRAINT "uq_products_code_branch" UNIQUE ("product_code", "branch_id"), CONSTRAINT "chk_products_code_positive" CHECK ("product_code" > 0), CONSTRAINT "chk_products_price_non_negative" CHECK ("price" >= 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "des_promotion" character varying(255) NOT NULL, "val_discount" numeric(10,2) NOT NULL DEFAULT '0', "extra_points" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "chk_promotions_discount" CHECK ("val_discount" >= 0), CONSTRAINT "chk_promotions_extra_points" CHECK ("extra_points" >= 0), CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "role" character varying(20) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "chk_users_role" CHECK ("role" IN ('ADMIN', 'MANAGER', 'ATTENDANT', 'KITCHEN')), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "fk_inventory_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "fk_loyalty_accounts_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "fk_loyalty_transactions_loyalty_account" FOREIGN KEY ("loyalty_account_id") REFERENCES "loyalty_accounts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "fk_loyalty_transactions_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movements" ADD CONSTRAINT "fk_movements_inventory" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movements" ADD CONSTRAINT "fk_movements_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "fk_order_items_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "fk_order_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_branch" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "fk_payments_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "fk_products_branch" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotions" ADD CONSTRAINT "fk_promotions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotions" ADD CONSTRAINT "fk_promotions_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "fk_users_branch" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "fk_users_branch"`);
        await queryRunner.query(`ALTER TABLE "promotions" DROP CONSTRAINT "fk_promotions_product"`);
        await queryRunner.query(`ALTER TABLE "promotions" DROP CONSTRAINT "fk_promotions_user"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_products_branch"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "fk_payments_order"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_branch"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_user"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "fk_orders_client"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "fk_order_items_product"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "fk_order_items_order"`);
        await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "fk_movements_user"`);
        await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "fk_movements_inventory"`);
        await queryRunner.query(`ALTER TABLE "loyalty_transactions" DROP CONSTRAINT "fk_loyalty_transactions_order"`);
        await queryRunner.query(`ALTER TABLE "loyalty_transactions" DROP CONSTRAINT "fk_loyalty_transactions_loyalty_account"`);
        await queryRunner.query(`ALTER TABLE "loyalty_accounts" DROP CONSTRAINT "fk_loyalty_accounts_client"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "fk_inventory_product"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "promotions"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "movements"`);
        await queryRunner.query(`DROP TABLE "loyalty_transactions"`);
        await queryRunner.query(`DROP TABLE "loyalty_accounts"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "branches"`);
    }
}
