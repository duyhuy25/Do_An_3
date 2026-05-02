"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMaintenance = exports.deleteMaintenance = exports.updateMaintenance = exports.addMaintenance = exports.getMaintenance = void 0;
const maintenanceServices_1 = require("../services/maintenanceServices");
const getMaintenance = async (req, res) => {
    try {
        const data = await (0, maintenanceServices_1.fetchMaintenance)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getMaintenance = getMaintenance;
const addMaintenance = async (req, res) => {
    try {
        await (0, maintenanceServices_1.addMaintenanceService)(req.body);
        res.json({ message: "Thêm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addMaintenance = addMaintenance;
const updateMaintenance = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, maintenanceServices_1.updateMaintenanceService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateMaintenance = updateMaintenance;
const deleteMaintenance = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, maintenanceServices_1.deleteMaintenanceService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteMaintenance = deleteMaintenance;
const searchMaintenance = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, maintenanceServices_1.searchMaintenanceService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchMaintenance = searchMaintenance;
