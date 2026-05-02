"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAuditLog = exports.deleteAuditLog = exports.updateAuditLog = exports.addAuditLog = exports.getAuditLogs = void 0;
const auditLogServices_1 = require("../services/auditLogServices");
const getAuditLogs = async (req, res) => {
    try {
        const data = await (0, auditLogServices_1.fetchAuditLogs)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getAuditLogs = getAuditLogs;
const addAuditLog = async (req, res) => {
    try {
        await (0, auditLogServices_1.addAuditLogService)(req.body);
        res.json({ message: "Thêm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addAuditLog = addAuditLog;
const updateAuditLog = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, auditLogServices_1.updateAuditLogService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateAuditLog = updateAuditLog;
const deleteAuditLog = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, auditLogServices_1.deleteAuditLogService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteAuditLog = deleteAuditLog;
const searchAuditLog = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, auditLogServices_1.searchAuditLogService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchAuditLog = searchAuditLog;
