"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAssignmentContainer = exports.deleteAssignmentContainer = exports.updateAssignmentContainer = exports.addAssignmentContainer = exports.getAssignmentContainers = void 0;
const assignmentContainersServices_1 = require("../services/assignmentContainersServices");
const getAssignmentContainers = async (req, res) => {
    try {
        const data = await (0, assignmentContainersServices_1.fetchAssignmentContainers)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getAssignmentContainers = getAssignmentContainers;
const addAssignmentContainer = async (req, res) => {
    try {
        await (0, assignmentContainersServices_1.addAssignmentContainerService)(req.body);
        res.json({ message: "Thêm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addAssignmentContainer = addAssignmentContainer;
const updateAssignmentContainer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, assignmentContainersServices_1.updateAssignmentContainerService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateAssignmentContainer = updateAssignmentContainer;
const deleteAssignmentContainer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, assignmentContainersServices_1.deleteAssignmentContainerService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteAssignmentContainer = deleteAssignmentContainer;
const searchAssignmentContainer = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, assignmentContainersServices_1.searchAssignmentContainerService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchAssignmentContainer = searchAssignmentContainer;
