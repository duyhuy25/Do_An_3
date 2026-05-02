"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMaintenanceService = exports.deleteMaintenanceService = exports.updateMaintenanceService = exports.addMaintenanceService = exports.fetchMaintenance = void 0;
const maintenanceRepositories_1 = require("../repositories/maintenanceRepositories");
const fetchMaintenance = async () => {
    return await (0, maintenanceRepositories_1.getAllMaintenance)();
};
exports.fetchMaintenance = fetchMaintenance;
const addMaintenanceService = async (data) => {
    return await (0, maintenanceRepositories_1.createMaintenance)(data);
};
exports.addMaintenanceService = addMaintenanceService;
const updateMaintenanceService = async (id, data) => {
    return await (0, maintenanceRepositories_1.updateMaintenanceById)(id, data);
};
exports.updateMaintenanceService = updateMaintenanceService;
const deleteMaintenanceService = async (id) => {
    return await (0, maintenanceRepositories_1.deleteMaintenanceById)(id);
};
exports.deleteMaintenanceService = deleteMaintenanceService;
const searchMaintenanceService = async (keyword) => {
    return await (0, maintenanceRepositories_1.searchMaintenanceByKeyword)(keyword);
};
exports.searchMaintenanceService = searchMaintenanceService;
