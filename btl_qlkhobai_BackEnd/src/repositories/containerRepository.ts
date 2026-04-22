import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllContainer = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      c.*,
      'CTN' + RIGHT('000' + CAST(c.ContainerID AS VARCHAR(3)), 3) AS FormattedID,
      lh.TenLoai,
      k.TenKho,
      pt.BienSo,
      kh.TenKH
    FROM Container c
    LEFT JOIN LoaiHang lh ON c.LoaiHangID = lh.LoaiHangID
    LEFT JOIN KhoLT k ON c.KhoID = k.KhoID
    LEFT JOIN PhuongTien pt ON c.PhuongTienID = pt.PhuongTienID
    LEFT JOIN HopDong hd ON c.HopDongID = hd.HopDongID
    LEFT JOIN KhachHang kh ON hd.KhachHangID = kh.KhachHangID
    ORDER BY c.ContainerID DESC
  `);

  return result.recordset;
};

export const createContainer = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("LoaiHangID", sql.Int, data.LoaiHangID)
    .input("TrongLuong", sql.Decimal(10, 2), data.TrongLuong)
    .input("TrangThai", sql.NVarChar, data.TrangThai || "Rỗng")
    .input("KhoID", sql.Int, data.KhoID || null)
    .input("PhuongTienID", sql.Int, data.PhuongTienID || null)
    .input("MaContainer", sql.NVarChar, data.MaContainer)
    .input("KichThuoc", sql.NVarChar, data.KichThuoc)
    .input("LoaiContainer", sql.NVarChar, data.LoaiContainer)
    .input("NgayDongHang", sql.Date, data.NgayDongHang || null)
    .input("NgayMoHang", sql.Date, data.NgayMoHang || null)
    .input("TinhTrangVo", sql.NVarChar, data.TinhTrangVo)
    .input("NhietDoBaoQuan", sql.Float, data.NhietDoBaoQuan)
    .input("DoAm", sql.Float, data.DoAm)
    .query(`
      INSERT INTO Container (
        HopDongID, LoaiHangID, TrongLuong, TrangThai, KhoID, PhuongTienID,
        MaContainer, KichThuoc, LoaiContainer, NgayDongHang, NgayMoHang,
        TinhTrangVo, NhietDoBaoQuan, DoAm
      )
      VALUES (
        @HopDongID, @LoaiHangID, @TrongLuong, @TrangThai, @KhoID, @PhuongTienID,
        @MaContainer, @KichThuoc, @LoaiContainer, @NgayDongHang, @NgayMoHang,
        @TinhTrangVo, @NhietDoBaoQuan, @DoAm
      )
    `);
};

export const updateContainer = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ContainerID", sql.Int, id)
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("LoaiHangID", sql.Int, data.LoaiHangID)
    .input("TrongLuong", sql.Decimal(10, 2), data.TrongLuong)
    .input("TrangThai", sql.NVarChar, data.TrangThai)
    .input("KhoID", sql.Int, data.KhoID || null)
    .input("PhuongTienID", sql.Int, data.PhuongTienID || null)
    .input("MaContainer", sql.NVarChar, data.MaContainer)
    .input("KichThuoc", sql.NVarChar, data.KichThuoc)
    .input("LoaiContainer", sql.NVarChar, data.LoaiContainer)
    .input("NgayDongHang", sql.Date, data.NgayDongHang || null)
    .input("NgayMoHang", sql.Date, data.NgayMoHang || null)
    .input("TinhTrangVo", sql.NVarChar, data.TinhTrangVo)
    .input("NhietDoBaoQuan", sql.Float, data.NhietDoBaoQuan)
    .input("DoAm", sql.Float, data.DoAm)
    .query(`
      UPDATE Container
      SET 
        HopDongID = @HopDongID,
        LoaiHangID = @LoaiHangID,
        TrongLuong = @TrongLuong,
        TrangThai = @TrangThai,
        KhoID = @KhoID,
        PhuongTienID = @PhuongTienID,
        MaContainer = @MaContainer,
        KichThuoc = @KichThuoc,
        LoaiContainer = @LoaiContainer,
        NgayDongHang = @NgayDongHang,
        NgayMoHang = @NgayMoHang,
        TinhTrangVo = @TinhTrangVo,
        NhietDoBaoQuan = @NhietDoBaoQuan,
        DoAm = @DoAm
      WHERE ContainerID = @ContainerID
    `);
};

export const deleteContainer = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ContainerID", sql.Int, id)
    .query("DELETE FROM Container WHERE ContainerID = @ContainerID");
};

export const searchContainer = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      c.*,
      'CTN' + RIGHT('000' + CAST(c.ContainerID AS VARCHAR(3)), 3) AS FormattedID,
      lh.TenLoai,
      k.TenKho,
      pt.BienSo,
      kh.TenKH
    FROM Container c
    LEFT JOIN LoaiHang lh ON c.LoaiHangID = lh.LoaiHangID
    LEFT JOIN KhoLT k ON c.KhoID = k.KhoID
    LEFT JOIN PhuongTien pt ON c.PhuongTienID = pt.PhuongTienID
    LEFT JOIN HopDong hd ON c.HopDongID = hd.HopDongID
    LEFT JOIN KhachHang kh ON hd.KhachHangID = kh.KhachHangID
  `;

  if (term) {
    query += `
      WHERE 
        ('CTN' + RIGHT('000' + CAST(c.ContainerID AS VARCHAR(3)), 3)) LIKE @search
        OR c.MaContainer LIKE @search
        OR c.TrangThai LIKE @search
        OR c.LoaiContainer LIKE @search
        OR c.KichThuoc LIKE @search
        OR lh.TenLoai LIKE @search
        OR k.TenKho LIKE @search
        OR pt.BienSo LIKE @search
        OR kh.TenKH LIKE @search
        OR CAST(c.HopDongID AS VARCHAR(10)) LIKE @search
        OR CAST(c.TrongLuong AS VARCHAR(20)) LIKE @search
    `;

    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY c.ContainerID DESC";

  const result = await request.query(query);
  return result.recordset;
};