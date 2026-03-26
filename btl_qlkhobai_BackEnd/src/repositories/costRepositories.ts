import { poolPromise } from "../config/db";

export const getAllCost = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM ChiPhi");

  return result.recordset;
};

export const createCost = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", data.HopDongID)
    .input("ContainerID", data.ContainerID)
    .input("LoaiChiPhi", data.LoaiChiPhi)
    .input("SoTien", data.SoTien)
    .input("ThuKhachHang", data.ThuKhachHang)
    .query(`
      INSERT INTO ChiPhi 
      (HopDongID, ContainerID, LoaiChiPhi, SoTien, ThuKhachHang)
      VALUES (@HopDongID, @ContainerID, @LoaiChiPhi, @SoTien, @ThuKhachHang)
    `);
};

export const updateCostById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .input("HopDongID", data.HopDongID)
    .input("ContainerID", data.ContainerID)
    .input("LoaiChiPhi", data.LoaiChiPhi)
    .input("SoTien", data.SoTien)
    .input("ThuKhachHang", data.ThuKhachHang)
    .query(`
      UPDATE ChiPhi SET
        HopDongID = @HopDongID,
        ContainerID = @ContainerID,
        LoaiChiPhi = @LoaiChiPhi,
        SoTien = @SoTien,
        ThuKhachHang = @ThuKhachHang
      WHERE ChiPhiID = @ChiPhiID
    `);
};

export const deleteCostById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .query("DELETE FROM ChiPhi WHERE ChiPhiID = @ChiPhiID");
};

export const searchCostByKeyword = async (keyword: string) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("keyword", `%${keyword}%`)
    .query(`
      SELECT * FROM ChiPhi
      WHERE LoaiChiPhi LIKE @keyword
         OR ThuKhachHang LIKE @keyword
    `);

  return result.recordset;
};