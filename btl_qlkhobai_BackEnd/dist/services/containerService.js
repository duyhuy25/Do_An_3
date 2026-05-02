"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContainersService = exports.deleteContainerService = exports.updateContainerService = exports.createContainerService = exports.fetchContainer = void 0;
const containerRepository_1 = require("../repositories/containerRepository");
const fetchContainer = async () => {
    return await (0, containerRepository_1.getAllContainer)();
};
exports.fetchContainer = fetchContainer;
const createContainerService = async (data) => {
    return await (0, containerRepository_1.createContainer)(data);
};
exports.createContainerService = createContainerService;
const updateContainerService = async (id, data) => {
    return await (0, containerRepository_1.updateContainer)(id, data);
};
exports.updateContainerService = updateContainerService;
const deleteContainerService = async (id) => {
    return await (0, containerRepository_1.deleteContainer)(id);
};
exports.deleteContainerService = deleteContainerService;
const searchContainersService = async (searchTerm = "") => {
    return await (0, containerRepository_1.searchContainer)(searchTerm);
};
exports.searchContainersService = searchContainersService;
