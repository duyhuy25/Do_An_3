import { poolPromise } from "../config/db";

export const getAllWarehouse = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM KhoLT");

  return result.recordset;
};