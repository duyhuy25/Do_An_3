import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllAuditLogs = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      a.*, 
      u.Username 
    FROM AuditLog a
    LEFT JOIN Users u ON a.UserID = u.UserID
    ORDER BY a.LogID DESC
  `);
  return result.recordset;
};

export const createAuditLog = async (data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("UserID", data.UserID)
    .input("HanhDong", data.HanhDong)
    .input("Bang", data.Bang)
    .input("ThoiGian", data.ThoiGian || new Date())
    .query(`
      INSERT INTO AuditLog (UserID, HanhDong, Bang, ThoiGian)
      VALUES (@UserID, @HanhDong, @Bang, @ThoiGian)
    `);
};

export const updateAuditLogById = async (id: number, data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("LogID", id)
    .input("UserID", data.UserID)
    .input("HanhDong", data.HanhDong)
    .input("Bang", data.Bang)
    .input("ThoiGian", data.ThoiGian)
    .query(`
      UPDATE AuditLog SET
        UserID = @UserID,
        HanhDong = @HanhDong,
        Bang = @Bang,
        ThoiGian = @ThoiGian
      WHERE LogID = @LogID
    `);
};

export const deleteAuditLogById = async (id: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("LogID", id)
    .query("DELETE FROM AuditLog WHERE LogID = @LogID");
};

export const searchAuditLogByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      a.*, 
      u.Username 
    FROM AuditLog a
    LEFT JOIN Users u ON a.UserID = u.UserID
  `;

  if (term) {
    query += ` WHERE a.HanhDong LIKE @search OR a.Bang LIKE @search OR u.Username LIKE @search`;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY a.LogID DESC";

  const result = await request.query(query);
  return result.recordset;
};
