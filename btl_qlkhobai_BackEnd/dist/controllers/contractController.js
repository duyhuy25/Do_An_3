"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContracts = exports.deleteContract = exports.updateContract = exports.addContract = exports.getContracts = void 0;
const contractServices_1 = require("../services/contractServices");
const getContracts = async (req, res) => {
    try {
        const data = await (0, contractServices_1.fetchContract)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getContracts = getContracts;
const workflowServices_1 = require("../services/workflowServices");
const addContract = async (req, res) => {
    try {
        const result = await (0, workflowServices_1.workflowCreateContractWithContainer)(req.body, "System");
        res.json({ message: result.message + (result.warning ? " " + result.warning : "") });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addContract = addContract;
const updateContract = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, contractServices_1.updateContractService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateContract = updateContract;
const deleteContract = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, contractServices_1.deleteContractService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteContract = deleteContract;
const searchContracts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const data = await (0, contractServices_1.searchContractService)(keyword);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchContracts = searchContracts;
