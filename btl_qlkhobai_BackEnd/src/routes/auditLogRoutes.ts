import express from "express";
import {
  getAuditLogs,
  addAuditLog,
  updateAuditLog,
  deleteAuditLog,
  searchAuditLog
} from "../controllers/auditLogController";

const router = express.Router();

router.get("/audit", getAuditLogs);
router.get("/audit/search", searchAuditLog);
router.post("/audit", addAuditLog);
router.put("/audit/:id", updateAuditLog);
router.delete("/audit/:id", deleteAuditLog);

export default router;
