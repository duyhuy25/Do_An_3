import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllUser = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
  SELECT 
    u.UserID,
    u.Username,
    u.HoTen,
    u.Email,
    u.TrangThai,
    u.RoleID,   
    u.SDT,
    u.DiaChi,
    u.NgaySinh,
    u.GioiTinh,
    u.Avatar,
    u.NgayTao,
    v.TenVaiTro
  FROM Users u
  LEFT JOIN VaiTro v ON u.RoleID = v.RoleID
  ORDER BY u.UserID ASC
`);

  return result.recordset;
};

export const createUser = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("Username", sql.NVarChar(50), data.Username)
    .input("PasswordHash", sql.NVarChar(255), data.PasswordHash)
    .input("HoTen", sql.NVarChar(100), data.HoTen)
    .input("Email", sql.NVarChar(100), data.Email)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai ?? "Hoạt động")
    .input("RoleID", sql.Int, data.RoleID)

    .input("SDT", sql.NVarChar(20), data.SDT)
    .input("DiaChi", sql.NVarChar(200), data.DiaChi)
    .input("NgaySinh", sql.Date, data.NgaySinh)
    .input("GioiTinh", sql.NVarChar(10), data.GioiTinh)
    .input("Avatar", sql.NVarChar(255), data.Avatar)

    .query(`
      INSERT INTO Users 
      (Username, PasswordHash, HoTen, Email, TrangThai, RoleID, SDT, DiaChi, NgaySinh, GioiTinh, Avatar)
      VALUES 
      (@Username, @PasswordHash, @HoTen, @Email, @TrangThai, @RoleID, @SDT, @DiaChi, @NgaySinh, @GioiTinh, @Avatar)
    `);
};
export const updateUserById = async (id: number, data: any) => {
  const pool = await poolPromise;
  const roleId = data.RoleID ? Number(data.RoleID) : 1;

  await pool.request()
    .input("UserID", sql.Int, id)
    .input("Username", sql.NVarChar(50), data.Username)
    .input("HoTen", sql.NVarChar(100), data.HoTen)
    .input("Email", sql.NVarChar(100), data.Email)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai ?? "Hoạt động")
    .input("RoleID", sql.Int, roleId)

    .input("SDT", sql.NVarChar(20), data.SDT)
    .input("DiaChi", sql.NVarChar(200), data.DiaChi)
    .input("NgaySinh", sql.Date, data.NgaySinh)
    .input("GioiTinh", sql.NVarChar(10), data.GioiTinh)
    .input("Avatar", sql.NVarChar(255), data.Avatar)

    .query(`
      UPDATE Users 
      SET 
        Username = @Username,
        HoTen = @HoTen,
        Email = @Email,
        TrangThai = @TrangThai,
        RoleID = @RoleID,
        SDT = @SDT,
        DiaChi = @DiaChi,
        NgaySinh = @NgaySinh,
        GioiTinh = @GioiTinh,
        Avatar = @Avatar
      WHERE UserID = @UserID
    `);
};
export const deleteUserById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("UserID", sql.Int, id)
    .query(`DELETE FROM Users WHERE UserID = @UserID`);
};

export const searchUserByKeyword = async (searchTerm: string = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm.trim();

  let query = `
    SELECT 
      u.UserID,
      u.Username,
      u.HoTen,
      u.Email,
      u.TrangThai,
      u.RoleID,   
      v.TenVaiTro
    FROM Users u
    LEFT JOIN VaiTro v ON u.RoleID = v.RoleID
  `;

  if (term) {
    query += `
      WHERE 
        u.Username LIKE @search
        OR u.HoTen LIKE @search
        OR u.Email LIKE @search
        OR u.SDT LIKE @search
        OR u.DiaChi LIKE @search
        OR u.GioiTinh LIKE @search
        OR v.TenVaiTro LIKE @search
        OR u.TrangThai LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY u.UserID DESC";

  const result = await request.query(query);
  return result.recordset;
};