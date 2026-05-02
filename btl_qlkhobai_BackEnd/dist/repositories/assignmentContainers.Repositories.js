"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAssignmentContainerByKeyword = exports.deleteAssignmentContainerById = exports.updateAssignmentContainerById = exports.createAssignmentContainer = exports.getAllAssignmentContainers = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllAssignmentContainers = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM PhanCongContainer ORDER BY ID DESC
  `);
    return result.recordset;
};
exports.getAllAssignmentContainers = getAllAssignmentContainers;
const createAssignmentContainer = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ContainerID", data.ContainerID)
        .input("ChuyenDiID", data.ChuyenDiID)
        .input("ThoiGianPhanCong", data.ThoiGianPhanCong ? new Date(data.ThoiGianPhanCong) : null)
        .input("TrangThai", data.TrangThai)
        .query(`
      INSERT INTO PhanCongContainer (ContainerID, ChuyenDiID, ThoiGianPhanCong, TrangThai)
      VALUES (@ContainerID, @ChuyenDiID, @ThoiGianPhanCong, @TrangThai)
    `);
};
exports.createAssignmentContainer = createAssignmentContainer;
const updateAssignmentContainerById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ID", id)
        .input("ContainerID", data.ContainerID)
        .input("ChuyenDiID", data.ChuyenDiID)
        .input("ThoiGianPhanCong", data.ThoiGianPhanCong ? new Date(data.ThoiGianPhanCong) : null)
        .input("TrangThai", data.TrangThai)
        .query(`
      UPDATE PhanCongContainer SET
        ContainerID = @ContainerID,
        ChuyenDiID = @ChuyenDiID,
        ThoiGianPhanCong = @ThoiGianPhanCong,
        TrangThai = @TrangThai
      WHERE ID = @ID
    `);
};
exports.updateAssignmentContainerById = updateAssignmentContainerById;
const deleteAssignmentContainerById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ID", id)
        .query("DELETE FROM PhanCongContainer WHERE ID = @ID");
};
exports.deleteAssignmentContainerById = deleteAssignmentContainerById;
const searchAssignmentContainerByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `SELECT * FROM PhanCongContainer`;
    if (term) {
        query += ` WHERE TrangThai LIKE @search`;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY ID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchAssignmentContainerByKeyword = searchAssignmentContainerByKeyword;
