"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleArrived = exports.startTransport = exports.enterWarehouse = exports.finishPacking = exports.startPacking = void 0;
const workflowServices_1 = require("../services/workflowServices");
const startPacking = async (req, res) => {
    try {
        const containerId = Number(req.params.containerId);
        const { nguoiCapNhat } = req.body;
        if (isNaN(containerId)) {
            res.status(400).json({ success: false, message: "Invalid Container ID" });
            return;
        }
        const result = await (0, workflowServices_1.workflowStartPacking)(containerId, nguoiCapNhat);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.startPacking = startPacking;
const finishPacking = async (req, res) => {
    try {
        const containerId = Number(req.params.containerId);
        const { nguoiCapNhat } = req.body;
        if (isNaN(containerId)) {
            res.status(400).json({ success: false, message: "Invalid Container ID" });
            return;
        }
        const result = await (0, workflowServices_1.workflowFinishPacking)(containerId, nguoiCapNhat);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.finishPacking = finishPacking;
const enterWarehouse = async (req, res) => {
    try {
        const containerId = Number(req.params.containerId);
        const { khoId, nguoiCapNhat } = req.body;
        if (isNaN(containerId) || !khoId) {
            res.status(400).json({ success: false, message: "Invalid Container ID or Kho ID" });
            return;
        }
        const result = await (0, workflowServices_1.workflowEnterWarehouse)(containerId, khoId, nguoiCapNhat);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.enterWarehouse = enterWarehouse;
const startTransport = async (req, res) => {
    try {
        const containerId = Number(req.params.containerId);
        const { chuyenDiId, phuongTienId, khoIdCu, nguoiCapNhat } = req.body;
        if (isNaN(containerId) || !chuyenDiId || !phuongTienId) {
            res.status(400).json({ success: false, message: "Missing required parameters" });
            return;
        }
        const result = await (0, workflowServices_1.workflowStartTransport)(containerId, chuyenDiId, phuongTienId, khoIdCu, nguoiCapNhat);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.startTransport = startTransport;
const vehicleArrived = async (req, res) => {
    try {
        const containerId = Number(req.params.containerId);
        const { chuyenDiId, phuongTienId, nguoiCapNhat } = req.body;
        if (isNaN(containerId)) {
            res.status(400).json({ success: false, message: "Invalid Container ID" });
            return;
        }
        const result = await (0, workflowServices_1.workflowVehicleArrived)(containerId, chuyenDiId, phuongTienId, nguoiCapNhat);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.vehicleArrived = vehicleArrived;
