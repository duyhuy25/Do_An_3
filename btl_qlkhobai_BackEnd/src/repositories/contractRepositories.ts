import { poolPromise } from "../config/db";

export const getAllContract = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM HopDong");
  return result.recordset;
};

export const createContract = async (data: any) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("KhachHangID", data.KhachHangID)
    .input("NgayKy", data.NgayKy)
    .input("NgayHetHan", data.NgayHetHan)
    .input("LoaiDichVu", data.LoaiDichVu)
    .input("GiaTri", data.GiaTri)
    .input("TrangThai", data.TrangThai)
    .query(`
      INSERT INTO HopDong 
      (KhachHangID, NgayKy, NgayHetHan, LoaiDichVu, GiaTri, TrangThai)
      VALUES (@KhachHangID, @NgayKy, @NgayHetHan, @LoaiDichVu, @GiaTri, @TrangThai)
    `);

  return result;
};

export const updateContractById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", id)
    .input("KhachHangID", data.KhachHangID)
    .input("NgayKy", data.NgayKy)
    .input("NgayHetHan", data.NgayHetHan)
    .input("LoaiDichVu", data.LoaiDichVu)
    .input("GiaTri", data.GiaTri)
    .input("TrangThai", data.TrangThai)
    .query(`
      UPDATE HopDong SET
        KhachHangID = @KhachHangID,
        NgayKy = @NgayKy,
        NgayHetHan = @NgayHetHan,
        LoaiDichVu = @LoaiDichVu,
        GiaTri = @GiaTri,
        TrangThai = @TrangThai
      WHERE HopDongID = @HopDongID
    `);
};

export const deleteContractById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", id)
    .query("DELETE FROM HopDong WHERE HopDongID = @HopDongID");
};

export const searchContractByKeyword = async (keyword: string) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("keyword", `%${keyword}%`)
    .query(`
      SELECT * FROM HopDong
      WHERE LoaiDichVu LIKE @keyword
         OR TrangThai LIKE @keyword
    `);

  return result.recordset;
};