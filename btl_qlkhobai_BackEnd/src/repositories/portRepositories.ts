import { poolPromise } from "../config/db";

export const getAllPort = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM Cang");

  return result.recordset;
};