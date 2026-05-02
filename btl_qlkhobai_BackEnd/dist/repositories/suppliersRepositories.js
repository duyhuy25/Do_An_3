"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSupplierByKeyword = exports.deleteSupplierById = exports.updateSupplierById = exports.createSupplier = exports.getAllSuppliers = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllSuppliers = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM NhaCungCap ORDER BY NCCID ASC
  `);
    return result.recordset;
};
exports.getAllSuppliers = getAllSuppliers;
const createSupplier = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("TenNCC", data.TenNCC)
        .input("DichVu", data.DichVu)
        .input("SDT", data.SDT)
        .input("Email", data.Email)
        .input("DiaChi", data.DiaChi)
        .query(`
      INSERT INTO NhaCungCap (TenNCC, DichVu, SDT, Email, DiaChi)
      VALUES (@TenNCC, @DichVu, @SDT, @Email, @DiaChi)
    `);
};
exports.createSupplier = createSupplier;
const updateSupplierById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("NCCID", id)
        .input("TenNCC", data.TenNCC)
        .input("DichVu", data.DichVu)
        .input("SDT", data.SDT)
        .input("Email", data.Email)
        .input("DiaChi", data.DiaChi)
        .query(`
      UPDATE NhaCungCap SET
        TenNCC = @TenNCC,
        DichVu = @DichVu,
        SDT = @SDT,
        Email = @Email,
        DiaChi = @DiaChi
      WHERE NCCID = @NCCID
    `);
};
exports.updateSupplierById = updateSupplierById;
const deleteSupplierById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("NCCID", id)
        .query("DELETE FROM NhaCungCap WHERE NCCID = @NCCID");
};
exports.deleteSupplierById = deleteSupplierById;
const searchSupplierByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `SELECT * FROM NhaCungCap`;
    if (term) {
        query += ` WHERE TenNCC LIKE @search OR DichVu LIKE @search OR SDT LIKE @search OR Email LIKE @search OR DiaChi LIKE @search`;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY NCCID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchSupplierByKeyword = searchSupplierByKeyword;
