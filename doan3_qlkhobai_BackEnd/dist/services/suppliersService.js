"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSupplierService = exports.deleteSupplierService = exports.updateSupplierService = exports.addSupplierService = exports.fetchSuppliers = void 0;
const suppliersRepositories_1 = require("../repositories/suppliersRepositories");
const fetchSuppliers = async () => {
    return await (0, suppliersRepositories_1.getAllSuppliers)();
};
exports.fetchSuppliers = fetchSuppliers;
const addSupplierService = async (data) => {
    return await (0, suppliersRepositories_1.createSupplier)(data);
};
exports.addSupplierService = addSupplierService;
const updateSupplierService = async (id, data) => {
    return await (0, suppliersRepositories_1.updateSupplierById)(id, data);
};
exports.updateSupplierService = updateSupplierService;
const deleteSupplierService = async (id) => {
    return await (0, suppliersRepositories_1.deleteSupplierById)(id);
};
exports.deleteSupplierService = deleteSupplierService;
const searchSupplierService = async (keyword) => {
    return await (0, suppliersRepositories_1.searchSupplierByKeyword)(keyword);
};
exports.searchSupplierService = searchSupplierService;
