import { AppDataSource } from "../../data-source.js";
import { USER_ROLES } from "../../constants/user-roles.js";
import { AppError } from "../../errors/appError.js";

const retrieveAuditLogsService = async (auditLogId, authentication) => {
  const auditLogRepository = AppDataSource.getRepository("AuditLog");
  const foundAuditLog = await auditLogRepository.findOne({
    where: { id: auditLogId },
    relations: { branch: true },
  });
  if (!foundAuditLog) throw new AppError("Registro de auditoria não encontrado.", 404);
  if (
    authentication.actor.role !== USER_ROLES.ADMIN &&
    foundAuditLog.branch?.id !== authentication.actor.branch.id
  ) {
    throw new AppError("Você não pode consultar auditorias de outra filial.", 403);
  }
  return foundAuditLog;
};

export default retrieveAuditLogsService;
