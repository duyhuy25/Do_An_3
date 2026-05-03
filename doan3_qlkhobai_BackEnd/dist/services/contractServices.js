"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContractService = exports.deleteContractService = exports.updateContractService = exports.addContractService = exports.fetchContract = void 0;
const contractRepositories_1 = require("../repositories/contractRepositories");
const fetchContract = async () => {
    return await (0, contractRepositories_1.getAllContract)();
};
exports.fetchContract = fetchContract;
const addContractService = async (data) => {
    return await (0, contractRepositories_1.createContract)(data);
};
exports.addContractService = addContractService;
const updateContractService = async (id, data) => {
    return await (0, contractRepositories_1.updateContractById)(id, data);
};
exports.updateContractService = updateContractService;
const deleteContractService = async (id) => {
    return await (0, contractRepositories_1.deleteContractById)(id);
};
exports.deleteContractService = deleteContractService;
const searchContractService = async (keyword) => {
    return await (0, contractRepositories_1.searchContractByKeyword)(keyword);
};
exports.searchContractService = searchContractService;
