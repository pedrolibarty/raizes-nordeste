import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";

const listAuditLogsService = async (authentication) => {
  const auditLogRepository = AppDataSource.getRepository("AuditLog");
  const where = authentication.actor.role === USER_ROLES.ADMIN
    ? {}
    : { branch: { id: authentication.actor.branch.id } };
  return auditLogRepository.find({
    where,
    relations: { branch: true },
    order: { createdAt: "DESC" },
  });
};

export default listAuditLogsService;
