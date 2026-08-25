const sanitizeAuditData = (data) => {
  if (!data) return null;
  const sanitizedData = { ...data };
  for (const sensitiveField of ["password", "cpf", "token", "requestPayload", "responsePayload"]) {
    delete sanitizedData[sensitiveField];
  }
  return sanitizedData;
};

const registerAuditLogsService = async (transactionManager, data) => {
  const auditLogRepository = transactionManager.getRepository("AuditLog");
  const createdAuditLog = auditLogRepository.create({
    actorId: data.authentication?.actorId ?? null,
    actorType: data.authentication?.actorType ?? "SYSTEM",
    action: data.action,
    entity: data.entity,
    entityId: data.entityId,
    branch: data.branchId ? { id: data.branchId } : null,
    oldData: sanitizeAuditData(data.oldData),
    newData: sanitizeAuditData(data.newData),
  });
  return auditLogRepository.save(createdAuditLog);
};

export default registerAuditLogsService;
