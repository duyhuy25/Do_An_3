import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllInvoice = async () => {
  const pool = await poolPromise;

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

export const createInvoice = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("SoTien", sql.Decimal(15, 2), data.SoTien)
    .input("NgayLap", sql.Date, data.NgayLap || new Date())
    .input("PhanTramDaThanhToan", sql.Int, data.PhanTramDaThanhToan || 0)
    .input("TrangThai", sql.NVarChar, data.TrangThai || "Chưa thanh toán")
    .input("HanThanhToan", sql.Date, data.HanThanhToan || null)
    .input("MaHoaDon", sql.NVarChar, data.MaHoaDon)
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

export const updateInvoiceById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HoaDonID", sql.Int, id)
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("SoTien", sql.Decimal(15, 2), data.SoTien)
    .input("NgayLap", sql.Date, data.NgayLap)
    .input("PhanTramDaThanhToan", sql.Int, data.PhanTramDaThanhToan)
    .input("TrangThai", sql.NVarChar, data.TrangThai)
    .input("HanThanhToan", sql.Date, data.HanThanhToan)
    .input("MaHoaDon", sql.NVarChar, data.MaHoaDon)
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

export const deleteInvoiceById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HoaDonID", id)
    .query("DELETE FROM HoaDon WHERE HoaDonID = @HoaDonID");
};

export const searchInvoiceByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
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

    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY hd.HoaDonID DESC";

  const result = await request.query(query);
  return result.recordset;
};