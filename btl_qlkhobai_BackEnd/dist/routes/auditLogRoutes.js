"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auditLogController_1 = require("../controllers/auditLogController");
const router = express_1.default.Router();
router.get("/audit", auditLogController_1.getAuditLogs);
router.get("/audit/search", auditLogController_1.searchAuditLog);
router.post("/audit", auditLogController_1.addAuditLog);
router.put("/audit/:id", auditLogController_1.updateAuditLog);
router.delete("/audit/:id", auditLogController_1.deleteAuditLog);
exports.default = router;
