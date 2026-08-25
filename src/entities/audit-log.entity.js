import { EntitySchema } from "typeorm";

export const AuditLog = new EntitySchema({
  name: "AuditLog",
  tableName: "audit_logs",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    actorId: { name: "actor_id", type: "uuid", nullable: true },
    actorType: { name: "actor_type", type: "varchar", length: 20 },
    action: { type: "varchar", length: 50 },
    entity: { type: "varchar", length: 50 },
    entityId: { name: "entity_id", type: "uuid" },
    oldData: { name: "old_data", type: "jsonb", nullable: true },
    newData: { name: "new_data", type: "jsonb", nullable: true },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    branch: {
      type: "many-to-one",
      target: "Branch",
      nullable: true,
      onDelete: "SET NULL",
      joinColumn: { name: "branch_id", referencedColumnName: "id" },
    },
  },
  checks: [{ name: "chk_audit_logs_actor_type", expression: `"actor_type" IN ('USER', 'CLIENT', 'SYSTEM')` }],
});
