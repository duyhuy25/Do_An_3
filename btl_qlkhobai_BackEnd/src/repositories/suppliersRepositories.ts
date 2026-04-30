import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllSuppliers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM NhaCungCap ORDER BY NCCID DESC
  `);
  return result.recordset;
};

export const createSupplier = async (data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("TenNCC", data.TenNCC)
    .input("DichVu", data.DichVu)
    .input("SDT", data.SDT)
    .input("Email", data.Email)
    .input("DiaChi", data.DiaChi)
    .query(`
      INSERT INTO NhaCungCap (TenNCC, DichVu, SDT, Email, DiaChi)
      VALUES (@TenNCC, @DichVu, @SDT, @Email, @DiaChi)
    `);
};

export const updateSupplierById = async (id: number, data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("NCCID", id)
    .input("TenNCC", data.TenNCC)
    .input("DichVu", data.DichVu)
    .input("SDT", data.SDT)
    .input("Email", data.Email)
    .input("DiaChi", data.DiaChi)
    .query(`
      UPDATE NhaCungCap SET
        TenNCC = @TenNCC,
        DichVu = @DichVu,
        SDT = @SDT,
        Email = @Email,
        DiaChi = @DiaChi
      WHERE NCCID = @NCCID
    `);
};

export const deleteSupplierById = async (id: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("NCCID", id)
    .query("DELETE FROM NhaCungCap WHERE NCCID = @NCCID");
};

export const searchSupplierByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `SELECT * FROM NhaCungCap`;

  if (term) {
    query += ` WHERE TenNCC LIKE @search OR DichVu LIKE @search OR SDT LIKE @search OR Email LIKE @search OR DiaChi LIKE @search`;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY NCCID DESC";

  const result = await request.query(query);
  return result.recordset;
};
