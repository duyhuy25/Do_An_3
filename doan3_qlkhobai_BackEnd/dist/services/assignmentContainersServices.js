"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAssignmentContainerService = exports.deleteAssignmentContainerService = exports.updateAssignmentContainerService = exports.addAssignmentContainerService = exports.fetchAssignmentContainers = void 0;
const assignmentContainers_Repositories_1 = require("../repositories/assignmentContainers.Repositories");
const fetchAssignmentContainers = async () => {
    return await (0, assignmentContainers_Repositories_1.getAllAssignmentContainers)();
};
exports.fetchAssignmentContainers = fetchAssignmentContainers;
const addAssignmentContainerService = async (data) => {
    return await (0, assignmentContainers_Repositories_1.createAssignmentContainer)(data);
};
exports.addAssignmentContainerService = addAssignmentContainerService;
const updateAssignmentContainerService = async (id, data) => {
    return await (0, assignmentContainers_Repositories_1.updateAssignmentContainerById)(id, data);
};
exports.updateAssignmentContainerService = updateAssignmentContainerService;
const deleteAssignmentContainerService = async (id) => {
    return await (0, assignmentContainers_Repositories_1.deleteAssignmentContainerById)(id);
};
exports.deleteAssignmentContainerService = deleteAssignmentContainerService;
const searchAssignmentContainerService = async (keyword) => {
    return await (0, assignmentContainers_Repositories_1.searchAssignmentContainerByKeyword)(keyword);
};
exports.searchAssignmentContainerService = searchAssignmentContainerService;
