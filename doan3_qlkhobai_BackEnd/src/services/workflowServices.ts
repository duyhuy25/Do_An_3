import sql from "mssql";
import { poolPromise } from "../config/db";
import { createAuditLog } from "../repositories/auditLogRepositories";
    // Bắt đầu đóng hàng
export const workflowStartPacking = async (containerId: number, nguoiCapNhat: string, userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    // 1. Lấy trạng thái hiện tại của container
    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai, KhoID FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;

    // 2. Cập nhật trạng thái container sang "Đang đóng hàng"
    await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đang đóng hàng'
      WHERE ContainerID = @ContainerID
    `);

    // 3. Ghi log lịch sử thay đổi
    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'ĐÓNG HÀNG')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Đang đóng hàng')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    // Ghi nhật ký hệ thống
    if (userId) {
       await createAuditLog({
         UserID: userId,
         HanhDong: "Bắt đầu đóng hàng",
         Bang: "Container"
       });
    }

    return { success: true, message: "Started packing successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowFinishPacking = async (containerId: number, nguoiCapNhat: string, userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;

    await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đã đóng hàng'
      WHERE ContainerID = @ContainerID
    `);

    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'ĐÓNG HÀNG')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Đã đóng hàng')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    if (userId) {
      await createAuditLog({
        UserID: userId,
        HanhDong: "Hoàn thành đóng hàng",
        Bang: "Container"
      });
    }

    return { success: true, message: "Finished packing successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowEnterWarehouse = async (containerId: number, khoId: number, nguoiCapNhat: string, userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;

    // Update Container
    await request
      .input("KhoID", sql.Int, khoId)
      .query(`
        UPDATE Container 
        SET TrangThai = N'Trong kho', KhoID = @KhoID
        WHERE ContainerID = @ContainerID
      `);

    // Update Warehouse Quantity
    await request.query(`
      UPDATE KhoLT 
      SET SoLuongContainer = ISNULL(SoLuongContainer, 0) + 1
      WHERE KhoID = @KhoID
    `);

    // Create Log
    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'NHẬP KHO')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Trong kho')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    if (userId) {
      await createAuditLog({
        UserID: userId,
        HanhDong: `Nhập kho (ID: ${khoId})`,
        Bang: "Container"
      });
    }

    return { success: true, message: "Entered warehouse successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowStartTransport = async (containerId: number, chuyenDiId: number, phuongTienId: number, khoIdCu: number, nguoiCapNhat: string, userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;

    // Update Container
    await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đang vận chuyển',
          PhuongTienID = @PhuongTienID
      WHERE ContainerID = @ContainerID
    `);

    // Set inputs for trip and vehicle
    request.input("ChuyenDiID", sql.Int, chuyenDiId);
    request.input("PhuongTienID", sql.Int, phuongTienId);

    // Update Trip
    await request.query(`
        UPDATE ChuyenDi 
        SET TrangThai = N'Đang chạy',
            PhuongTienID = @PhuongTienID
        WHERE ChuyenDiID = @ChuyenDiID
      `);

    // Update Vehicle
    await request.query(`
        UPDATE PhuongTien 
        SET TrangThai = N'Đang chạy'
        WHERE PhuongTienID = @PhuongTienID
      `);

    // Update Warehouse (if it was in a warehouse)
    if (khoIdCu) {
      await request
        .input("KhoID", sql.Int, khoIdCu)
        .query(`
          UPDATE KhoLT 
          SET SoLuongContainer = CASE WHEN ISNULL(SoLuongContainer, 0) > 0 THEN SoLuongContainer - 1 ELSE 0 END
          WHERE KhoID = @KhoID
        `);
    }

    // Upsert PhanCongContainer
    await request.query(`
      IF EXISTS (SELECT 1 FROM PhanCongContainer WHERE ContainerID = @ContainerID AND ChuyenDiID = @ChuyenDiID)
      BEGIN
        UPDATE PhanCongContainer
        SET TrangThai = N'Đang vận chuyển'
        WHERE ContainerID = @ContainerID AND ChuyenDiID = @ChuyenDiID
      END
      ELSE
      BEGIN
        INSERT INTO PhanCongContainer (ContainerID, ChuyenDiID, ThoiGianPhanCong, TrangThai)
        VALUES (@ContainerID, @ChuyenDiID, GETDATE(), N'Đang vận chuyển')
      END
    `);

    // Create Log
    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'VẬN CHUYỂN')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Đang vận chuyển')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    if (userId) {
      await createAuditLog({
        UserID: userId,
        HanhDong: "Bắt đầu vận chuyển",
        Bang: "Container"
      });
    }

    return { success: true, message: "Started transport successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowVehicleArrived = async (containerId: number, chuyenDiId: number, phuongTienId: number, nguoiCapNhat: string, userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;

    // Update Container
    await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đã đến nơi'
      WHERE ContainerID = @ContainerID
    `);

    // Create Log
    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'ĐẾN NƠI')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Đã đến nơi')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    if (userId) {
      await createAuditLog({
        UserID: userId,
        HanhDong: "Xe đã đến nơi",
        Bang: "Container"
      });
    }

    return { success: true, message: "Vehicle arrived successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowCreateContractWithContainer = async (data: any, nguoiCapNhat: string = "System", userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    // 1. Create Contract
    const contractRes = await request
      .input("KhachHangID", sql.Int, data.KhachHangID)
      .input("NgayKy", sql.Date, data.NgayKy)
      .input("NgayHetHan", sql.Date, data.NgayHetHan || null)
      .input("LoaiDichVu", sql.NVarChar(100), data.LoaiDichVu || null)
      .input("GiaTri", sql.Decimal(15,2), data.GiaTri || 0)
      .input("TrangThai", sql.NVarChar(50), data.TrangThai ?? "Hiệu lực")
      .input("MaHopDong", sql.NVarChar(50), data.MaHopDong || null)
      .input("MoTa", sql.NVarChar(500), data.MoTa || null)
      .input("FileHopDong", sql.NVarChar(255), data.FileHopDong || null)
      .input("DieuKhoan", sql.NVarChar(sql.MAX), data.DieuKhoan || null)
      .query(`
        INSERT INTO HopDong (KhachHangID, NgayKy, NgayHetHan, LoaiDichVu, GiaTri, TrangThai, MaHopDong, MoTa, FileHopDong, DieuKhoan)
        OUTPUT INSERTED.HopDongID
        VALUES (@KhachHangID, @NgayKy, @NgayHetHan, @LoaiDichVu, @GiaTri, @TrangThai, @MaHopDong, @MoTa, @FileHopDong, @DieuKhoan)
      `);
      
    const hopDongId = contractRes.recordset[0].HopDongID;

    // 2. Find a ready vehicle
    const vehicleRes = await request.query(`
      SELECT TOP 1 PhuongTienID FROM PhuongTien WHERE TrangThai = N'Sẵn sàng'
    `);
    
    let phuongTienId = null;
    let warning = "";
    if (vehicleRes.recordset.length > 0) {
      phuongTienId = vehicleRes.recordset[0].PhuongTienID;
    } else {
      warning = "Cảnh báo: Không có xe nào sẵn sàng. Container được tạo nhưng chưa gắn phương tiện.";
    }

    // 3. Get a default LoaiHangID to satisfy NOT NULL constraint
    const loaiHangRes = await request.query(`SELECT TOP 1 LoaiHangID FROM LoaiHang`);
    let loaiHangId = 1; // fallback
    if (loaiHangRes.recordset.length > 0) {
      loaiHangId = loaiHangRes.recordset[0].LoaiHangID;
    }

    // 4. Create Container
    const autoMaContainer = "CONT-" + new Date().getTime().toString().slice(-6);
    const containerRes = await request
      .input("HopDongID_Container", sql.Int, hopDongId)
      .input("PhuongTienID", sql.Int, phuongTienId)
      .input("LoaiHangID", sql.Int, loaiHangId)
      .input("MaContainer", sql.NVarChar, autoMaContainer)
      .query(`
        INSERT INTO Container (HopDongID, TrangThai, PhuongTienID, LoaiHangID, TrongLuong, MaContainer)
        OUTPUT INSERTED.ContainerID
        VALUES (@HopDongID_Container, N'Rỗng', @PhuongTienID, @LoaiHangID, 0, @MaContainer)
      `);
      
    const containerId = containerRes.recordset[0].ContainerID;

    // 5. Create History Log
    await request
      .input("ContainerID_History", sql.Int, containerId)
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'Tạo')
      .input("TrangThaiCu", sql.NVarChar, '')
      .input("TrangThaiMoi", sql.NVarChar, 'Rỗng')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID_History, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    const finalUserId = userId || data.UserID;
    if (finalUserId) {
      await createAuditLog({
        UserID: finalUserId,
        HanhDong: "Tạo hợp đồng & Container",
        Bang: "HopDong"
      });
    }

    return { 
      success: true, 
      message: "Thêm hợp đồng và tự động tạo Container (Rỗng) thành công.",
      warning: warning 
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowDeliverContainer = async (containerId: number, nguoiCapNhat: string, userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai, PhuongTienID FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;

    const finalPhuongTienId = containerRes.recordset[0].PhuongTienID;
    
    // Tìm chuyến đi đang liên kết
    let finalChuyenDiId = null;
    const phanCongRes = await request.query(`
      SELECT TOP 1 ChuyenDiID FROM PhanCongContainer 
      WHERE ContainerID = @ContainerID AND TrangThai = N'Đang vận chuyển' 
      ORDER BY ID DESC
    `);
    if (phanCongRes.recordset.length > 0) {
      finalChuyenDiId = phanCongRes.recordset[0].ChuyenDiID;
    }

    // Update Container to "Đã giao"
    await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đã giao'
      WHERE ContainerID = @ContainerID
    `);

    // Update Trip if valid
    if (finalChuyenDiId) {
      request.input("ChuyenDiID_Update", sql.Int, finalChuyenDiId);

      // Cập nhật trạng thái phân công của container hiện tại
      await request.query(`
        UPDATE PhanCongContainer
        SET TrangThai = N'Hoàn tất'
        WHERE ContainerID = @ContainerID AND ChuyenDiID = @ChuyenDiID_Update
      `);

      // Kiểm tra xem còn container nào khác chưa hoàn thành trong chuyến đi này không
      const checkRemainingRes = await request.query(`
        SELECT COUNT(*) as RemainingCount FROM PhanCongContainer 
        WHERE ChuyenDiID = @ChuyenDiID_Update AND TrangThai NOT IN (N'Hoàn tất', N'Hủy')
      `);

      const remainingCount = checkRemainingRes.recordset[0].RemainingCount;

      if (remainingCount === 0) {
        // Nếu tất cả container đã giao xong, đưa chuyến đi về "Chuẩn bị" để có thể tái sử dụng (hoặc Hoàn thành tùy nghiệp vụ, ở đây tôi chọn Chuẩn bị theo ý người dùng)
        await request.query(`
          UPDATE ChuyenDi 
          SET TrangThai = N'Chuẩn bị',
              PhuongTienID = NULL -- Giải phóng xe khỏi chuyến đi để xe có thể đi chuyến khác
          WHERE ChuyenDiID = @ChuyenDiID_Update
        `);
      }
    }

    // Update Vehicle if valid
    let vehicleIdToRelease = finalPhuongTienId;

    if (!vehicleIdToRelease && finalChuyenDiId) {
      const tripRes = await request
        .input("ChuyenDiID_Trip", sql.Int, finalChuyenDiId)
        .query(`SELECT PhuongTienID FROM ChuyenDi WHERE ChuyenDiID = @ChuyenDiID_Trip`);
      if (tripRes.recordset.length > 0) {
        vehicleIdToRelease = tripRes.recordset[0].PhuongTienID;
      }
    }

    if (vehicleIdToRelease) {
      await request
        .input("PhuongTienID_Update", sql.Int, vehicleIdToRelease)
        .query(`
          UPDATE PhuongTien 
          SET TrangThai = N'Sẵn sàng'
          WHERE PhuongTienID = @PhuongTienID_Update
        `);
    }

    // Create Log
    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'GIAO HÀNG')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Đã giao')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    if (userId) {
      await createAuditLog({
        UserID: userId,
        HanhDong: "Giao hàng hoàn tất",
        Bang: "Container"
      });
    }

    return { success: true, message: "Delivered container successfully" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const workflowCancelContainer = async (containerId: number, nguoiCapNhat: string = "System", userId?: number) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  
  await transaction.begin();
  try {
    const request = transaction.request();

    const containerRes = await request
      .input("ContainerID", sql.Int, containerId)
      .query(`SELECT TrangThai, PhuongTienID FROM Container WHERE ContainerID = @ContainerID`);
    
    if (containerRes.recordset.length === 0) throw new Error("Container not found");
    const trangThaiCu = containerRes.recordset[0].TrangThai;
    const finalPhuongTienId = containerRes.recordset[0].PhuongTienID;
    
    // Tìm chuyến đi đang liên kết
    let finalChuyenDiId = null;
    const phanCongRes = await request.query(`
      SELECT TOP 1 ChuyenDiID FROM PhanCongContainer 
      WHERE ContainerID = @ContainerID AND TrangThai != N'Hủy'
      ORDER BY ID DESC
    `);
    if (phanCongRes.recordset.length > 0) {
      finalChuyenDiId = phanCongRes.recordset[0].ChuyenDiID;
    }

    // Update Container to "Hủy"
    await request.query(`
      UPDATE Container 
      SET TrangThai = N'Hủy'
      WHERE ContainerID = @ContainerID
    `);

    if (finalChuyenDiId) {
      request.input("ChuyenDiID_Update", sql.Int, finalChuyenDiId);

      // Cập nhật phân công thành Hủy
      await request.query(`
        UPDATE PhanCongContainer
        SET TrangThai = N'Hủy'
        WHERE ContainerID = @ContainerID AND ChuyenDiID = @ChuyenDiID_Update
      `);

      // Đếm xem chuyến đi còn container nào không
      const countRes = await request.query(`
        SELECT COUNT(*) as ActiveCount FROM PhanCongContainer 
        WHERE ChuyenDiID = @ChuyenDiID_Update AND TrangThai != N'Hủy'
      `);
      
      const activeCount = countRes.recordset[0].ActiveCount;
      
      // Nếu chuyến đi rỗng, hủy chuyến đi và giải phóng phương tiện
      if (activeCount === 0) {
        await request.query(`
          UPDATE ChuyenDi 
          SET TrangThai = N'Hủy'
          WHERE ChuyenDiID = @ChuyenDiID_Update
        `);

        if (finalPhuongTienId) {
          request.input("PhuongTienID_Update", sql.Int, finalPhuongTienId);
          await request.query(`
            UPDATE PhuongTien 
            SET TrangThai = N'Sẵn sàng'
            WHERE PhuongTienID = @PhuongTienID_Update
          `);
        }
      }
    }

    // Create Log
    await request
      .input("ThoiGian", sql.DateTime, new Date())
      .input("HoatDong", sql.NVarChar, 'HỦY')
      .input("TrangThaiCu", sql.NVarChar, trangThaiCu)
      .input("TrangThaiMoi", sql.NVarChar, 'Hủy')
      .input("NguoiCapNhat", sql.NVarChar, nguoiCapNhat)
      .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);

    await transaction.commit();

    if (userId) {
      await createAuditLog({
        UserID: userId,
        HanhDong: "Hủy đơn hàng",
        Bang: "Container"
      });
    }

    return { success: true, message: "Đã hủy đơn thành công" };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
