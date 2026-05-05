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
    .input("PhuongTienID", data.PhuongTienID)
    .input("NgayBaoTri", data.NgayBaoTri)
    .input("NoiDung", data.NoiDung)
    .input("ChiPhi", data.ChiPhi)
    .input("TrangThai", data.TrangThai)
    .input("NCCID", data.NCCID || null)
    .query(`
      INSERT INTO BaoTriPhuongTien (PhuongTienID, NgayBaoTri, NoiDung, ChiPhi, TrangThai, NCCID)
      VALUES (@PhuongTienID, @NgayBaoTri, @NoiDung, @ChiPhi, @TrangThai, @NCCID)
    `);
};

export const updateMaintenanceById = async (id: number, data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("BaoTriID", id)
    .input("PhuongTienID", data.PhuongTienID)
    .input("NgayBaoTri", data.NgayBaoTri)
    .input("NoiDung", data.NoiDung)
    .input("ChiPhi", data.ChiPhi)
    .input("TrangThai", data.TrangThai)
    .input("NCCID", data.NCCID || null)
    .query(`
      UPDATE BaoTriPhuongTien SET
        PhuongTienID = @PhuongTienID,
        NgayBaoTri = @NgayBaoTri,
        NoiDung = @NoiDung,
        ChiPhi = @ChiPhi,
        TrangThai = @TrangThai,
        NCCID = @NCCID
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
