/**
 * @typedef {import("typeorm").MigrationInterface} MigrationInterface
 * @typedef {import("typeorm").QueryRunner} QueryRunner
 */

export class RemoveDeclinedOrderStatus1787540000000 {
  name = "RemoveDeclinedOrderStatus1787540000000";

  async up(queryRunner) {
    await queryRunner.query(
      `UPDATE "orders" SET "status" = 'A' WHERE "status" = 'N'`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "chk_orders_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "chk_orders_status" CHECK ("status" IN ('A', 'P', 'C', 'R', 'E', 'X'))`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "chk_orders_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "chk_orders_status" CHECK ("status" IN ('A', 'P', 'C', 'R', 'E', 'X', 'N'))`,
    );
  }
}
