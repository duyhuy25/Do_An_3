import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllContract = async () => {
  const pool = await poolPromise;
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

export const createContract = async (data: any) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("KhachHangID", sql.Int, data.KhachHangID)
    .input("NgayKy", sql.Date, data.NgayKy || null)
    .input("NgayHetHan", sql.Date, data.NgayHetHan || null)
    .input("LoaiDichVu", sql.NVarChar(100), data.LoaiDichVu || null)
    .input("GiaTri", sql.Decimal(15,2), data.GiaTri || 0)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai || "Hiệu lực")
    .input("MaHopDong", sql.NVarChar(50), data.MaHopDong || null)
    .input("MoTa", sql.NVarChar(500), data.MoTa || null)
    .input("FileHopDong", sql.NVarChar(255), data.FileHopDong || null)
    .input("DieuKhoan", sql.NVarChar(sql.MAX), data.DieuKhoan || null)

    .query(`
      INSERT INTO HopDong 
      (KhachHangID, NgayKy, NgayHetHan, LoaiDichVu, GiaTri, TrangThai, MaHopDong, MoTa, FileHopDong, DieuKhoan)
      VALUES (@KhachHangID, @NgayKy, @NgayHetHan, @LoaiDichVu, @GiaTri, @TrangThai, @MaHopDong, @MoTa, @FileHopDong, @DieuKhoan)
    `);

  return result;
};

export const updateContractById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", sql.Int, id)
    .input("KhachHangID", sql.Int, data.KhachHangID)
    .input("NgayKy", sql.Date, data.NgayKy || null)
    .input("NgayHetHan", sql.Date, data.NgayHetHan || null)
    .input("LoaiDichVu", sql.NVarChar(100), data.LoaiDichVu || null)
    .input("GiaTri", sql.Decimal(15,2), data.GiaTri || 0)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai || "Hiệu lực")
    .input("MaHopDong", sql.NVarChar(50), data.MaHopDong || null)
    .input("MoTa", sql.NVarChar(500), data.MoTa || null)
    .input("FileHopDong", sql.NVarChar(255), data.FileHopDong || null)
    .input("DieuKhoan", sql.NVarChar(sql.MAX), data.DieuKhoan || null)

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

export const deleteContractById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", id)
    .query("DELETE FROM HopDong WHERE HopDongID = @HopDongID");
};

export const searchContractByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
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
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }
  query += " ORDER BY h.HopDongID DESC";

  const result = await request.query(query);
  return result.recordset;
};