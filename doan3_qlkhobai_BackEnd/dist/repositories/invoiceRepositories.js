"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInvoiceByKeyword = exports.deleteInvoiceById = exports.updateInvoiceById = exports.createInvoice = exports.getAllInvoice = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllInvoice = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      hd.*,
      'HD' + RIGHT('000' + CAST(hd.HoaDonID AS VARCHAR(3)), 3) AS FormattedID,
      kh.TenKH
    FROM HoaDon hd
    LEFT JOIN HopDong h ON hd.HopDongID = h.HopDongID
    LEFT JOIN KhachHang kh ON h.KhachHangID = kh.KhachHangID
    ORDER BY hd.HoaDonID ASC
  `);
    return result.recordset;
};
exports.getAllInvoice = getAllInvoice;
const createInvoice = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HopDongID", mssql_1.default.Int, data.HopDongID)
        .input("SoTien", mssql_1.default.Decimal(15, 2), data.SoTien)
        .input("NgayLap", mssql_1.default.Date, data.NgayLap || new Date())
        .input("PhanTramDaThanhToan", mssql_1.default.Int, data.PhanTramDaThanhToan || 0)
        .input("TrangThai", mssql_1.default.NVarChar, data.TrangThai || "Chưa thanh toán")
        .input("HanThanhToan", mssql_1.default.Date, data.HanThanhToan || null)
        .input("MaHoaDon", mssql_1.default.NVarChar, data.MaHoaDon)
        .query(`
      INSERT INTO HoaDon (
        HopDongID, SoTien, NgayLap,
        PhanTramDaThanhToan, TrangThai,
        HanThanhToan, MaHoaDon
      )
      VALUES (
        @HopDongID, @SoTien, @NgayLap,
        @PhanTramDaThanhToan, @TrangThai,
        @HanThanhToan, @MaHoaDon
      )
    `);
};
exports.createInvoice = createInvoice;
const updateInvoiceById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HoaDonID", mssql_1.default.Int, id)
        .input("HopDongID", mssql_1.default.Int, data.HopDongID)
        .input("SoTien", mssql_1.default.Decimal(15, 2), data.SoTien)
        .input("NgayLap", mssql_1.default.Date, data.NgayLap)
        .input("PhanTramDaThanhToan", mssql_1.default.Int, data.PhanTramDaThanhToan)
        .input("TrangThai", mssql_1.default.NVarChar, data.TrangThai)
        .input("HanThanhToan", mssql_1.default.Date, data.HanThanhToan)
        .input("MaHoaDon", mssql_1.default.NVarChar, data.MaHoaDon)
        .query(`
      UPDATE HoaDon SET
        HopDongID = @HopDongID,
        SoTien = @SoTien,
        NgayLap = @NgayLap,
        PhanTramDaThanhToan = @PhanTramDaThanhToan,
        TrangThai = @TrangThai,
        HanThanhToan = @HanThanhToan,
        MaHoaDon = @MaHoaDon
      WHERE HoaDonID = @HoaDonID
    `);
};
exports.updateInvoiceById = updateInvoiceById;
const deleteInvoiceById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HoaDonID", id)
        .query("DELETE FROM HoaDon WHERE HoaDonID = @HoaDonID");
};
exports.deleteInvoiceById = deleteInvoiceById;
const searchInvoiceByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      hd.*,
      'HD' + RIGHT('000' + CAST(hd.HoaDonID AS VARCHAR(3)), 3) AS FormattedID,
      kh.TenKH
    FROM HoaDon hd
    LEFT JOIN HopDong h ON hd.HopDongID = h.HopDongID
    LEFT JOIN KhachHang kh ON h.KhachHangID = kh.KhachHangID
  `;
    if (term) {
        query += `
      WHERE 
        ('HD' + RIGHT('000' + CAST(hd.HoaDonID AS VARCHAR(3)), 3)) LIKE @search
        OR hd.MaHoaDon LIKE @search
        OR kh.TenKH LIKE @search
        OR hd.TrangThai LIKE @search
        OR CAST(hd.SoTien AS VARCHAR(20)) LIKE @search
        OR CAST(hd.PhanTramDaThanhToan AS VARCHAR(10)) LIKE @search
        OR CAST(hd.NgayLap AS VARCHAR(20)) LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY hd.HoaDonID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchInvoiceByKeyword = searchInvoiceByKeyword;
