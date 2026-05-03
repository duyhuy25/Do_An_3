"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentById = exports.createPayment = exports.getPaymentsByInvoiceId = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getPaymentsByInvoiceId = async (hoaDonId) => {
    const pool = await db_1.poolPromise;
    const result = await pool.request()
        .input("HoaDonID", mssql_1.default.Int, hoaDonId)
        .query(`
      SELECT * FROM ThanhToan 
      WHERE HoaDonID = @HoaDonID 
      ORDER BY ThoiGian DESC
    `);
    return result.recordset;
};
exports.getPaymentsByInvoiceId = getPaymentsByInvoiceId;
const createPayment = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HoaDonID", mssql_1.default.Int, data.HoaDonID)
        .input("SoTien", mssql_1.default.Decimal(15, 2), data.SoTien)
        .input("PhuongThuc", mssql_1.default.NVarChar(50), data.PhuongThuc)
        .input("ThoiGian", mssql_1.default.DateTime, data.ThoiGian ? new Date(data.ThoiGian) : new Date())
        .query(`
      INSERT INTO ThanhToan (HoaDonID, SoTien, PhuongThuc, ThoiGian)
      VALUES (@HoaDonID, @SoTien, @PhuongThuc, @ThoiGian)
    `);
};
exports.createPayment = createPayment;
const deletePaymentById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ThanhToanID", mssql_1.default.Int, id)
        .query("DELETE FROM ThanhToan WHERE ThanhToanID = @ThanhToanID");
};
exports.deletePaymentById = deletePaymentById;
