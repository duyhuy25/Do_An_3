"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContractByKeyword = exports.deleteContractById = exports.updateContractById = exports.createContract = exports.getAllContract = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const getAllContract = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      h.*,
      kh.TenKH,
      'HD' + RIGHT('000' + CAST(h.HopDongID AS VARCHAR(3)), 3) AS FormattedID
    FROM HopDong h
    LEFT JOIN KhachHang kh ON h.KhachHangID = kh.KhachHangID
    ORDER BY h.HopDongID DESC
  `);
    return result.recordset;
};
exports.getAllContract = getAllContract;
const createContract = async (data) => {
    const pool = await db_1.poolPromise;
    const result = await pool.request()
        .input("KhachHangID", mssql_1.default.Int, data.KhachHangID)
        .input("NgayKy", mssql_1.default.Date, data.NgayKy)
        .input("NgayHetHan", mssql_1.default.Date, data.NgayHetHan)
        .input("LoaiDichVu", mssql_1.default.NVarChar(100), data.LoaiDichVu)
        .input("GiaTri", mssql_1.default.Decimal(15, 2), data.GiaTri)
        .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai ?? "Hiệu lực")
        .input("MaHopDong", mssql_1.default.NVarChar(50), data.MaHopDong)
        .input("MoTa", mssql_1.default.NVarChar(500), data.MoTa)
        .input("FileHopDong", mssql_1.default.NVarChar(255), data.FileHopDong)
        .input("DieuKhoan", mssql_1.default.NVarChar(mssql_1.default.MAX), data.DieuKhoan)
        .query(`
      INSERT INTO HopDong 
      (KhachHangID, NgayKy, NgayHetHan, LoaiDichVu, GiaTri, TrangThai, MaHopDong, MoTa, FileHopDong, DieuKhoan)
      VALUES (@KhachHangID, @NgayKy, @NgayHetHan, @LoaiDichVu, @GiaTri, @TrangThai, @MaHopDong, @MoTa, @FileHopDong, @DieuKhoan)
    `);
    return result;
};
exports.createContract = createContract;
const updateContractById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HopDongID", mssql_1.default.Int, id)
        .input("KhachHangID", mssql_1.default.Int, data.KhachHangID)
        .input("NgayKy", mssql_1.default.Date, data.NgayKy)
        .input("NgayHetHan", mssql_1.default.Date, data.NgayHetHan)
        .input("LoaiDichVu", mssql_1.default.NVarChar(100), data.LoaiDichVu)
        .input("GiaTri", mssql_1.default.Decimal(15, 2), data.GiaTri)
        .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai ?? "Hiệu lực")
        .input("MaHopDong", mssql_1.default.NVarChar(50), data.MaHopDong)
        .input("MoTa", mssql_1.default.NVarChar(500), data.MoTa)
        .input("FileHopDong", mssql_1.default.NVarChar(255), data.FileHopDong)
        .input("DieuKhoan", mssql_1.default.NVarChar(mssql_1.default.MAX), data.DieuKhoan)
        .query(`
      UPDATE HopDong SET
        KhachHangID = @KhachHangID,
        NgayKy = @NgayKy,
        NgayHetHan = @NgayHetHan,
        LoaiDichVu = @LoaiDichVu,
        GiaTri = @GiaTri,
        TrangThai = @TrangThai,
        MaHopDong = @MaHopDong,
        MoTa = @MoTa,
        FileHopDong = @FileHopDong,
        DieuKhoan = @DieuKhoan
      WHERE HopDongID = @HopDongID
    `);
};
exports.updateContractById = updateContractById;
const deleteContractById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HopDongID", id)
        .query("DELETE FROM HopDong WHERE HopDongID = @HopDongID");
};
exports.deleteContractById = deleteContractById;
const searchContractByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      h.*,
      kh.TenKH,
      'HD' + RIGHT('000' + CAST(h.HopDongID AS VARCHAR(3)), 3) AS FormattedID
    FROM HopDong h
    LEFT JOIN KhachHang kh ON h.KhachHangID = kh.KhachHangID
  `;
    if (term) {
        query += `
      WHERE 
        ('HD' + RIGHT('000' + CAST(h.HopDongID AS VARCHAR(3)), 3)) LIKE @search
        OR kh.TenKH LIKE @search
        OR h.LoaiDichVu LIKE @search
        OR h.TrangThai LIKE @search
        OR h.MaHopDong LIKE @search
        OR h.MoTa LIKE @search
        OR CAST(h.GiaTri AS VARCHAR(20)) LIKE @search
      `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY h.HopDongID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchContractByKeyword = searchContractByKeyword;
