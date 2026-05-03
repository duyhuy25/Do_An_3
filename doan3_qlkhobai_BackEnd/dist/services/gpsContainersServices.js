"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGpsContainerService = exports.deleteGpsContainerService = exports.updateGpsContainerService = exports.addGpsContainerService = exports.fetchGpsContainers = void 0;
const gpsContainersRepositories_1 = require("../repositories/gpsContainersRepositories");
const fetchGpsContainers = async () => {
    return await (0, gpsContainersRepositories_1.getAllGpsContainers)();
};
exports.fetchGpsContainers = fetchGpsContainers;
const addGpsContainerService = async (data) => {
    return await (0, gpsContainersRepositories_1.createGpsContainer)(data);
};
exports.addGpsContainerService = addGpsContainerService;
const updateGpsContainerService = async (id, data) => {
    return await (0, gpsContainersRepositories_1.updateGpsContainerById)(id, data);
};
exports.updateGpsContainerService = updateGpsContainerService;
const deleteGpsContainerService = async (id) => {
    return await (0, gpsContainersRepositories_1.deleteGpsContainerById)(id);
};
exports.deleteGpsContainerService = deleteGpsContainerService;
const searchGpsContainerService = async (keyword) => {
    return await (0, gpsContainersRepositories_1.searchGpsContainerByKeyword)(keyword);
};
exports.searchGpsContainerService = searchGpsContainerService;
