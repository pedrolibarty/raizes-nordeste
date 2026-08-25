import listAuditLogsService from "../services/auditLogs/listAuditLogs.service.js";
import retrieveAuditLogsService from "../services/auditLogs/retrieveAuditLogs.service.js";

export const listAuditLogsController = async (req, res) => {
  const auditLogs = await listAuditLogsService(req.auth);
  return res.status(200).json({ data: auditLogs });
};

export const retrieveAuditLogsController = async (req, res) => {
  const auditLog = await retrieveAuditLogsService(req.params.id, req.auth);
  return res.status(200).json({ data: auditLog });
};
