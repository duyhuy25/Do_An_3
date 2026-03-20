import { poolPromise } from "../config/db";

export const getAllUser = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM Users");

  return result.recordset;
};