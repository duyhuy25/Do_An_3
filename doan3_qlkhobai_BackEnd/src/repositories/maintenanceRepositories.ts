import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllMaintenance = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM BaoTriPhuongTien ORDER BY BaoTriID DESC
  `);
  return result.recordset;
};

export const createMaintenance = async (data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("PhuongTienID", sql.Int, data.PhuongTienID)
    .input("NgayBaoTri", sql.Date, data.NgayBaoTri)
    .input("NoiDung", sql.NVarChar(500), data.NoiDung)
    .input("ChiPhi", sql.Decimal(18, 2), data.ChiPhi)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai)
    .query(`
      INSERT INTO BaoTriPhuongTien (PhuongTienID, NgayBaoTri, NoiDung, ChiPhi, TrangThai)
      VALUES (@PhuongTienID, @NgayBaoTri, @NoiDung, @ChiPhi, @TrangThai)
    `);
};

export const updateMaintenanceById = async (id: number, data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("BaoTriID", sql.Int, id)
    .input("PhuongTienID", sql.Int, data.PhuongTienID)
    .input("NgayBaoTri", sql.Date, data.NgayBaoTri)
    .input("NoiDung", sql.NVarChar(500), data.NoiDung)
    .input("ChiPhi", sql.Decimal(18, 2), data.ChiPhi)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai)
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

export const deleteMaintenanceById = async (id: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("BaoTriID", id)
    .query("DELETE FROM BaoTriPhuongTien WHERE BaoTriID = @BaoTriID");
};

export const searchMaintenanceByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `SELECT * FROM BaoTriPhuongTien`;

  if (term) {
    query += ` WHERE NoiDung LIKE @search OR TrangThai LIKE @search`;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY BaoTriID DESC";

  const result = await request.query(query);
  return result.recordset;
};
