import { poolPromise } from "../config/db";

export const getAllHistory = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM LichSuContainer");

  return result.recordset;
};