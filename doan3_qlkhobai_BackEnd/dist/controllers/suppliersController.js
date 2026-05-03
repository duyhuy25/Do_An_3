"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSupplier = exports.deleteSupplier = exports.updateSupplier = exports.addSupplier = exports.getSuppliers = void 0;
const suppliersService_1 = require("../services/suppliersService");
const getSuppliers = async (req, res) => {
    try {
        const data = await (0, suppliersService_1.fetchSuppliers)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getSuppliers = getSuppliers;
const addSupplier = async (req, res) => {
    try {
        await (0, suppliersService_1.addSupplierService)(req.body);
        res.json({ message: "Thêm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addSupplier = addSupplier;
const updateSupplier = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, suppliersService_1.updateSupplierService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateSupplier = updateSupplier;
const deleteSupplier = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, suppliersService_1.deleteSupplierService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteSupplier = deleteSupplier;
const searchSupplier = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, suppliersService_1.searchSupplierService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchSupplier = searchSupplier;
