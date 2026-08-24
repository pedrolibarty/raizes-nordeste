/**
 * @typedef {import("typeorm").MigrationInterface} MigrationInterface
 * @typedef {import("typeorm").QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class UpdateLoyaltyTransactionTypes1787538544129 {
  name = "UpdateLoyaltyTransactionTypes1787538544129";

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "loyalty_transactions"
      DROP CONSTRAINT "chk_loyalty_transactions_type"
    `);

    await queryRunner.query(`
      ALTER TABLE "loyalty_transactions"
      ADD CONSTRAINT "chk_loyalty_transactions_type"
      CHECK ("transaction_type" IN ('E', 'S'))
    `);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "loyalty_transactions"
      DROP CONSTRAINT "chk_loyalty_transactions_type"
    `);

    await queryRunner.query(`
      ALTER TABLE "loyalty_transactions"
      ADD CONSTRAINT "chk_loyalty_transactions_type"
      CHECK ("transaction_type" IN ('E', 'R', 'A', 'X', 'V'))
    `);
  }
}
