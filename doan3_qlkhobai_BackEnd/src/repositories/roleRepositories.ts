import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllRoles = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM VaiTro");
  return result.recordset;
};
