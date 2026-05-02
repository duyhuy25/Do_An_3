"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAuditLogService = exports.deleteAuditLogService = exports.updateAuditLogService = exports.addAuditLogService = exports.fetchAuditLogs = void 0;
const auditLogRepositories_1 = require("../repositories/auditLogRepositories");
const fetchAuditLogs = async () => {
    return await (0, auditLogRepositories_1.getAllAuditLogs)();
};
exports.fetchAuditLogs = fetchAuditLogs;
const addAuditLogService = async (data) => {
    return await (0, auditLogRepositories_1.createAuditLog)(data);
};
exports.addAuditLogService = addAuditLogService;
const updateAuditLogService = async (id, data) => {
    return await (0, auditLogRepositories_1.updateAuditLogById)(id, data);
};
exports.updateAuditLogService = updateAuditLogService;
const deleteAuditLogService = async (id) => {
    return await (0, auditLogRepositories_1.deleteAuditLogById)(id);
};
exports.deleteAuditLogService = deleteAuditLogService;
const searchAuditLogService = async (keyword) => {
    return await (0, auditLogRepositories_1.searchAuditLogByKeyword)(keyword);
};
exports.searchAuditLogService = searchAuditLogService;
