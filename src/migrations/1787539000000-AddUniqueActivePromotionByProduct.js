/**
 * @typedef {import("typeorm").MigrationInterface} MigrationInterface
 * @typedef {import("typeorm").QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class AddUniqueActivePromotionByProduct1787539000000 {
  name = "AddUniqueActivePromotionByProduct1787539000000";

  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_promotions_active_product"
      ON "promotions" ("product_id")
      WHERE "is_active" = TRUE
    `);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    await queryRunner.query(`
      DROP INDEX "public"."uq_promotions_active_product"
    `);
  }
}
