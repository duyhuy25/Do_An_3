"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGpsContainer = exports.deleteGpsContainer = exports.updateGpsContainer = exports.addGpsContainer = exports.getGpsContainers = void 0;
const gpsContainersServices_1 = require("../services/gpsContainersServices");
const getGpsContainers = async (req, res) => {
    try {
        const data = await (0, gpsContainersServices_1.fetchGpsContainers)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getGpsContainers = getGpsContainers;
const addGpsContainer = async (req, res) => {
    try {
        await (0, gpsContainersServices_1.addGpsContainerService)(req.body);
        res.json({ message: "Thêm thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addGpsContainer = addGpsContainer;
const updateGpsContainer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, gpsContainersServices_1.updateGpsContainerService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateGpsContainer = updateGpsContainer;
const deleteGpsContainer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, gpsContainersServices_1.deleteGpsContainerService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteGpsContainer = deleteGpsContainer;
const searchGpsContainer = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, gpsContainersServices_1.searchGpsContainerService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchGpsContainer = searchGpsContainer;
