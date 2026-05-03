import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllAssignmentContainers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM PhanCongContainer ORDER BY ID DESC
  `);
  return result.recordset;
};

export const createAssignmentContainer = async (data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("ContainerID", data.ContainerID)
    .input("ChuyenDiID", data.ChuyenDiID)
    .input("ThoiGianPhanCong", data.ThoiGianPhanCong ? new Date(data.ThoiGianPhanCong) : null)
    .input("TrangThai", data.TrangThai)
    .query(`
      INSERT INTO PhanCongContainer (ContainerID, ChuyenDiID, ThoiGianPhanCong, TrangThai)
      VALUES (@ContainerID, @ChuyenDiID, @ThoiGianPhanCong, @TrangThai)
    `);
};

export const updateAssignmentContainerById = async (id: number, data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("ID", id)
    .input("ContainerID", data.ContainerID)
    .input("ChuyenDiID", data.ChuyenDiID)
    .input("ThoiGianPhanCong", data.ThoiGianPhanCong ? new Date(data.ThoiGianPhanCong) : null)
    .input("TrangThai", data.TrangThai)
    .query(`
      UPDATE PhanCongContainer SET
        ContainerID = @ContainerID,
        ChuyenDiID = @ChuyenDiID,
        ThoiGianPhanCong = @ThoiGianPhanCong,
        TrangThai = @TrangThai
      WHERE ID = @ID
    `);
};

export const deleteAssignmentContainerById = async (id: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("ID", id)
    .query("DELETE FROM PhanCongContainer WHERE ID = @ID");
};

export const searchAssignmentContainerByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `SELECT * FROM PhanCongContainer`;

  if (term) {
    query += ` WHERE TrangThai LIKE @search`;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY ID DESC";

  const result = await request.query(query);
  return result.recordset;
};
