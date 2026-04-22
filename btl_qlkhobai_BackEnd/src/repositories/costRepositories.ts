import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllCost = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      cp.*,
      'CP' + RIGHT('000' + CAST(cp.ChiPhiID AS VARCHAR(3)), 3) AS FormattedID,
      kh.TenKH,
      c.ContainerID
    FROM ChiPhi cp
    LEFT JOIN HopDong hd ON cp.HopDongID = hd.HopDongID
    LEFT JOIN KhachHang kh ON hd.KhachHangID = kh.KhachHangID
    LEFT JOIN Container c ON cp.ContainerID = c.ContainerID
    ORDER BY cp.ChiPhiID DESC
  `);

  return result.recordset;
};

export const createCost = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("ContainerID", sql.Int, data.ContainerID)
    .input("LoaiChiPhi", sql.NVarChar, data.LoaiChiPhi)
    .input("SoTien", sql.Decimal(15, 2), data.SoTien)
    .input("ThuKhachHang", sql.NVarChar, data.ThuKhachHang || "Không")
    .input("NgayPhatSinh", sql.Date, data.NgayPhatSinh || new Date())
    .input("TrangThaiThanhToan", sql.NVarChar, data.TrangThaiThanhToan)
    .input("NhaCungCap", sql.NVarChar, data.NhaCungCap)
    .query(`
      INSERT INTO ChiPhi (
        HopDongID, ContainerID, LoaiChiPhi, SoTien,
        ThuKhachHang, NgayPhatSinh, TrangThaiThanhToan, NhaCungCap
      )
      VALUES (
        @HopDongID, @ContainerID, @LoaiChiPhi, @SoTien,
        @ThuKhachHang, @NgayPhatSinh, @TrangThaiThanhToan, @NhaCungCap
      )
    `);
};

export const updateCostById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", sql.Int, id)
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("ContainerID", sql.Int, data.ContainerID)
    .input("LoaiChiPhi", sql.NVarChar, data.LoaiChiPhi)
    .input("SoTien", sql.Decimal(15, 2), data.SoTien)
    .input("ThuKhachHang", sql.NVarChar, data.ThuKhachHang)
    .input("NgayPhatSinh", sql.Date, data.NgayPhatSinh)
    .input("TrangThaiThanhToan", sql.NVarChar, data.TrangThaiThanhToan)
    .input("NhaCungCap", sql.NVarChar, data.NhaCungCap)
    .query(`
      UPDATE ChiPhi SET
        HopDongID = @HopDongID,
        ContainerID = @ContainerID,
        LoaiChiPhi = @LoaiChiPhi,
        SoTien = @SoTien,
        ThuKhachHang = @ThuKhachHang,
        NgayPhatSinh = @NgayPhatSinh,
        TrangThaiThanhToan = @TrangThaiThanhToan,
        NhaCungCap = @NhaCungCap
      WHERE ChiPhiID = @ChiPhiID
    `);
};

export const deleteCostById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .query("DELETE FROM ChiPhi WHERE ChiPhiID = @ChiPhiID");
};

export const searchCostByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      cp.*,
      'CP' + RIGHT('000' + CAST(cp.ChiPhiID AS VARCHAR(3)), 3) AS FormattedID,
      kh.TenKH,
      c.ContainerID
    FROM ChiPhi cp
    LEFT JOIN HopDong hd ON cp.HopDongID = hd.HopDongID
    LEFT JOIN KhachHang kh ON hd.KhachHangID = kh.KhachHangID
    LEFT JOIN Container c ON cp.ContainerID = c.ContainerID
  `;

  if (term) {
    query += `
      WHERE 
        ('CP' + RIGHT('000' + CAST(cp.ChiPhiID AS VARCHAR(3)), 3)) LIKE @search
        OR cp.LoaiChiPhi LIKE @search
        OR cp.ThuKhachHang LIKE @search
        OR cp.TrangThaiThanhToan LIKE @search
        OR cp.NhaCungCap LIKE @search
        OR kh.TenKH LIKE @search
        OR CAST(cp.SoTien AS VARCHAR(20)) LIKE @search
        OR CAST(cp.NgayPhatSinh AS VARCHAR(20)) LIKE @search
    `;

    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY cp.ChiPhiID ASC";

  const result = await request.query(query);
  return result.recordset;
};