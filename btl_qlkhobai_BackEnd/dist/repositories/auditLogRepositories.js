"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAuditLogByKeyword = exports.deleteAuditLogById = exports.updateAuditLogById = exports.createAuditLog = exports.getAllAuditLogs = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllAuditLogs = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM AuditLog ORDER BY LogID DESC
  `);
    return result.recordset;
};
exports.getAllAuditLogs = getAllAuditLogs;
const createAuditLog = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("UserID", data.UserID)
        .input("HanhDong", data.HanhDong)
        .input("Bang", data.Bang)
        .input("ThoiGian", data.ThoiGian || new Date())
        .query(`
      INSERT INTO AuditLog (UserID, HanhDong, Bang, ThoiGian)
      VALUES (@UserID, @HanhDong, @Bang, @ThoiGian)
    `);
};
exports.createAuditLog = createAuditLog;
const updateAuditLogById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("LogID", id)
        .input("UserID", data.UserID)
        .input("HanhDong", data.HanhDong)
        .input("Bang", data.Bang)
        .input("ThoiGian", data.ThoiGian)
        .query(`
      UPDATE AuditLog SET
        UserID = @UserID,
        HanhDong = @HanhDong,
        Bang = @Bang,
        ThoiGian = @ThoiGian
      WHERE LogID = @LogID
    `);
};
exports.updateAuditLogById = updateAuditLogById;
const deleteAuditLogById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("LogID", id)
        .query("DELETE FROM AuditLog WHERE LogID = @LogID");
};
exports.deleteAuditLogById = deleteAuditLogById;
const searchAuditLogByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `SELECT * FROM AuditLog`;
    if (term) {
        query += ` WHERE HanhDong LIKE @search OR Bang LIKE @search`;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY LogID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchAuditLogByKeyword = searchAuditLogByKeyword;
