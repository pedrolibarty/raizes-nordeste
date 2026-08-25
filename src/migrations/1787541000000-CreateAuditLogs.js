export class CreateAuditLogs1787541000000 {
  name = "CreateAuditLogs1787541000000";

  async up(queryRunner) {
    await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "actor_id" uuid, "actor_type" character varying(20) NOT NULL, "action" character varying(50) NOT NULL, "entity" character varying(50) NOT NULL, "entity_id" uuid NOT NULL, "old_data" jsonb, "new_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" uuid, CONSTRAINT "chk_audit_logs_actor_type" CHECK ("actor_type" IN ('USER', 'CLIENT', 'SYSTEM')), CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "fk_audit_logs_branch" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL`);
    await queryRunner.query(`CREATE INDEX "idx_audit_logs_branch_created_at" ON "audit_logs" ("branch_id", "created_at")`);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "audit_logs"`);
  }
}
