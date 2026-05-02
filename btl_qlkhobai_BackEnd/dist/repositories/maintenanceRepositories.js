"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMaintenanceByKeyword = exports.deleteMaintenanceById = exports.updateMaintenanceById = exports.createMaintenance = exports.getAllMaintenance = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllMaintenance = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM BaoTriPhuongTien ORDER BY BaoTriID DESC
  `);
    return result.recordset;
};
exports.getAllMaintenance = getAllMaintenance;
const createMaintenance = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("PhuongTienID", data.PhuongTienID)
        .input("NgayBaoTri", data.NgayBaoTri)
        .input("NoiDung", data.NoiDung)
        .input("ChiPhi", data.ChiPhi)
        .input("TrangThai", data.TrangThai)
        .query(`
      INSERT INTO BaoTriPhuongTien (PhuongTienID, NgayBaoTri, NoiDung, ChiPhi, TrangThai)
      VALUES (@PhuongTienID, @NgayBaoTri, @NoiDung, @ChiPhi, @TrangThai)
    `);
};
exports.createMaintenance = createMaintenance;
const updateMaintenanceById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("BaoTriID", id)
        .input("PhuongTienID", data.PhuongTienID)
        .input("NgayBaoTri", data.NgayBaoTri)
        .input("NoiDung", data.NoiDung)
        .input("ChiPhi", data.ChiPhi)
        .input("TrangThai", data.TrangThai)
        .query(`
      UPDATE BaoTriPhuongTien SET
        PhuongTienID = @PhuongTienID,
        NgayBaoTri = @NgayBaoTri,
        NoiDung = @NoiDung,
        ChiPhi = @ChiPhi,
        TrangThai = @TrangThai
      WHERE BaoTriID = @BaoTriID
    `);
};
exports.updateMaintenanceById = updateMaintenanceById;
const deleteMaintenanceById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("BaoTriID", id)
        .query("DELETE FROM BaoTriPhuongTien WHERE BaoTriID = @BaoTriID");
};
exports.deleteMaintenanceById = deleteMaintenanceById;
const searchMaintenanceByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `SELECT * FROM BaoTriPhuongTien`;
    if (term) {
        query += ` WHERE NoiDung LIKE @search OR TrangThai LIKE @search`;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY BaoTriID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchMaintenanceByKeyword = searchMaintenanceByKeyword;
