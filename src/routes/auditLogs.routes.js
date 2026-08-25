import { Router } from "express";
import { USER_ROLES } from "../constants/user-roles.js";
import {
  listAuditLogsController,
  retrieveAuditLogsController,
} from "../controllers/auditLogs.controllers.js";
import isLoggedInMiddleware from "../middlewares/isLoggedIn.middleware.js";
import verifyUserRoleMiddleware from "../middlewares/verifyUserRole.middleware.js";
import validateAuditLogIdMiddleware from "../middlewares/validateAuditLogs.middleware.js";

const auditLogRoutes = Router();

auditLogRoutes.use(
  isLoggedInMiddleware,
  verifyUserRoleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
);
auditLogRoutes.get("/", listAuditLogsController);
auditLogRoutes.get("/:id", validateAuditLogIdMiddleware, retrieveAuditLogsController);

export default auditLogRoutes;
