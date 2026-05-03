"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowCreateContractWithContainer = exports.workflowVehicleArrived = exports.workflowStartTransport = exports.workflowEnterWarehouse = exports.workflowFinishPacking = exports.workflowStartPacking = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
// Bắt đầu đóng hàng
const workflowStartPacking = async (containerId, nguoiCapNhat) => {
    const pool = await db_1.poolPromise;
    const transaction = new mssql_1.default.Transaction(pool);
    await transaction.begin();
    try {
        const request = transaction.request();
        // 1. Lấy trạng thái hiện tại của container
        const containerRes = await request
            .input("ContainerID", mssql_1.default.Int, containerId)
            .query(`SELECT TrangThai, KhoID FROM Container WHERE ContainerID = @ContainerID`);
        if (containerRes.recordset.length === 0)
            throw new Error("Container not found");
        const trangThaiCu = containerRes.recordset[0].TrangThai;
        // 2. Cập nhật trạng thái container sang "Đang đóng hàng"
        await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đang đóng hàng'
      WHERE ContainerID = @ContainerID
    `);
        // 3. Ghi log lịch sử thay đổi
        await request
            .input("ThoiGian", mssql_1.default.DateTime, new Date())
            .input("HoatDong", mssql_1.default.NVarChar, 'ĐÓNG HÀNG')
            .input("TrangThaiCu", mssql_1.default.NVarChar, trangThaiCu)
            .input("TrangThaiMoi", mssql_1.default.NVarChar, 'Đang đóng hàng')
            .input("NguoiCapNhat", mssql_1.default.NVarChar, nguoiCapNhat)
            .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);
        await transaction.commit();
        return { success: true, message: "Started packing successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.workflowStartPacking = workflowStartPacking;
const workflowFinishPacking = async (containerId, nguoiCapNhat) => {
    const pool = await db_1.poolPromise;
    const transaction = new mssql_1.default.Transaction(pool);
    await transaction.begin();
    try {
        const request = transaction.request();
        const containerRes = await request
            .input("ContainerID", mssql_1.default.Int, containerId)
            .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
        if (containerRes.recordset.length === 0)
            throw new Error("Container not found");
        const trangThaiCu = containerRes.recordset[0].TrangThai;
        await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đã đóng hàng'
      WHERE ContainerID = @ContainerID
    `);
        await request
            .input("ThoiGian", mssql_1.default.DateTime, new Date())
            .input("HoatDong", mssql_1.default.NVarChar, 'ĐÓNG HÀNG')
            .input("TrangThaiCu", mssql_1.default.NVarChar, trangThaiCu)
            .input("TrangThaiMoi", mssql_1.default.NVarChar, 'Đã đóng hàng')
            .input("NguoiCapNhat", mssql_1.default.NVarChar, nguoiCapNhat)
            .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);
        await transaction.commit();
        return { success: true, message: "Finished packing successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.workflowFinishPacking = workflowFinishPacking;
const workflowEnterWarehouse = async (containerId, khoId, nguoiCapNhat) => {
    const pool = await db_1.poolPromise;
    const transaction = new mssql_1.default.Transaction(pool);
    await transaction.begin();
    try {
        const request = transaction.request();
        const containerRes = await request
            .input("ContainerID", mssql_1.default.Int, containerId)
            .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
        if (containerRes.recordset.length === 0)
            throw new Error("Container not found");
        const trangThaiCu = containerRes.recordset[0].TrangThai;
        // Update Container
        await request
            .input("KhoID", mssql_1.default.Int, khoId)
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
            .input("ThoiGian", mssql_1.default.DateTime, new Date())
            .input("HoatDong", mssql_1.default.NVarChar, 'NHẬP KHO')
            .input("TrangThaiCu", mssql_1.default.NVarChar, trangThaiCu)
            .input("TrangThaiMoi", mssql_1.default.NVarChar, 'Trong kho')
            .input("NguoiCapNhat", mssql_1.default.NVarChar, nguoiCapNhat)
            .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);
        await transaction.commit();
        return { success: true, message: "Entered warehouse successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.workflowEnterWarehouse = workflowEnterWarehouse;
const workflowStartTransport = async (containerId, chuyenDiId, phuongTienId, khoIdCu, nguoiCapNhat) => {
    const pool = await db_1.poolPromise;
    const transaction = new mssql_1.default.Transaction(pool);
    await transaction.begin();
    try {
        const request = transaction.request();
        const containerRes = await request
            .input("ContainerID", mssql_1.default.Int, containerId)
            .query(`SELECT TrangThai FROM Container WHERE ContainerID = @ContainerID`);
        if (containerRes.recordset.length === 0)
            throw new Error("Container not found");
        const trangThaiCu = containerRes.recordset[0].TrangThai;
        // Update Container
        await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đang vận chuyển'
      WHERE ContainerID = @ContainerID
    `);
        // Update Trip
        await request
            .input("ChuyenDiID", mssql_1.default.Int, chuyenDiId)
            .query(`
        UPDATE ChuyenDi 
        SET TrangThai = N'Đang chạy'
        WHERE ChuyenDiID = @ChuyenDiID
      `);
        // Update Vehicle
        await request
            .input("PhuongTienID", mssql_1.default.Int, phuongTienId)
            .query(`
        UPDATE PhuongTien 
        SET TrangThai = N'Đang chạy'
        WHERE PhuongTienID = @PhuongTienID
      `);
        // Update Warehouse (if it was in a warehouse)
        if (khoIdCu) {
            await request
                .input("KhoID", mssql_1.default.Int, khoIdCu)
                .query(`
          UPDATE KhoLT 
          SET SoLuongContainer = CASE WHEN ISNULL(SoLuongContainer, 0) > 0 THEN SoLuongContainer - 1 ELSE 0 END
          WHERE KhoID = @KhoID
        `);
        }
        // Update PhanCongContainer
        await request.query(`
      UPDATE PhanCongContainer
      SET TrangThai = N'Đang vận chuyển'
      WHERE ContainerID = @ContainerID AND ChuyenDiID = @ChuyenDiID
    `);
        // Create Log
        await request
            .input("ThoiGian", mssql_1.default.DateTime, new Date())
            .input("HoatDong", mssql_1.default.NVarChar, 'VẬN CHUYỂN')
            .input("TrangThaiCu", mssql_1.default.NVarChar, trangThaiCu)
            .input("TrangThaiMoi", mssql_1.default.NVarChar, 'Đang vận chuyển')
            .input("NguoiCapNhat", mssql_1.default.NVarChar, nguoiCapNhat)
            .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);
        await transaction.commit();
        return { success: true, message: "Started transport successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.workflowStartTransport = workflowStartTransport;
const workflowVehicleArrived = async (containerId, chuyenDiId, phuongTienId, nguoiCapNhat) => {
    const pool = await db_1.poolPromise;
    const transaction = new mssql_1.default.Transaction(pool);
    await transaction.begin();
    try {
        const request = transaction.request();
        const containerRes = await request
            .input("ContainerID", mssql_1.default.Int, containerId)
            .query(`SELECT TrangThai, PhuongTienID FROM Container WHERE ContainerID = @ContainerID`);
        if (containerRes.recordset.length === 0)
            throw new Error("Container not found");
        const trangThaiCu = containerRes.recordset[0].TrangThai;
        let finalChuyenDiId = chuyenDiId;
        let finalPhuongTienId = phuongTienId || containerRes.recordset[0].PhuongTienID;
        if (!finalChuyenDiId) {
            const phanCongRes = await request.query(`
        SELECT TOP 1 ChuyenDiID FROM PhanCongContainer 
        WHERE ContainerID = @ContainerID AND TrangThai = N'Đang vận chuyển' 
        ORDER BY PhanCongID DESC
      `);
            if (phanCongRes.recordset.length > 0) {
                finalChuyenDiId = phanCongRes.recordset[0].ChuyenDiID;
            }
        }
        // Update Container
        await request.query(`
      UPDATE Container 
      SET TrangThai = N'Đã đến nơi'
      WHERE ContainerID = @ContainerID
    `);
        // Update Trip if valid
        if (finalChuyenDiId) {
            await request
                .input("ChuyenDiID_Update", mssql_1.default.Int, finalChuyenDiId)
                .query(`
          UPDATE ChuyenDi 
          SET TrangThai = N'Hoàn thành'
          WHERE ChuyenDiID = @ChuyenDiID_Update
        `);
            // Update PhanCongContainer
            await request.query(`
        UPDATE PhanCongContainer
        SET TrangThai = N'Hoàn tất'
        WHERE ContainerID = @ContainerID AND ChuyenDiID = @ChuyenDiID_Update
      `);
        }
        // Update Vehicle if valid
        if (finalPhuongTienId) {
            await request
                .input("PhuongTienID_Update", mssql_1.default.Int, finalPhuongTienId)
                .query(`
          UPDATE PhuongTien 
          SET TrangThai = N'Sẵn sàng'
          WHERE PhuongTienID = @PhuongTienID_Update
        `);
        }
        // Create Log
        await request
            .input("ThoiGian", mssql_1.default.DateTime, new Date())
            .input("HoatDong", mssql_1.default.NVarChar, 'ĐẾN NƠI')
            .input("TrangThaiCu", mssql_1.default.NVarChar, trangThaiCu)
            .input("TrangThaiMoi", mssql_1.default.NVarChar, 'Đã đến nơi')
            .input("NguoiCapNhat", mssql_1.default.NVarChar, nguoiCapNhat)
            .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);
        await transaction.commit();
        return { success: true, message: "Vehicle arrived successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.workflowVehicleArrived = workflowVehicleArrived;
const workflowCreateContractWithContainer = async (data, nguoiCapNhat = "System") => {
    const pool = await db_1.poolPromise;
    const transaction = new mssql_1.default.Transaction(pool);
    await transaction.begin();
    try {
        const request = transaction.request();
        // 1. Create Contract
        const contractRes = await request
            .input("KhachHangID", mssql_1.default.Int, data.KhachHangID)
            .input("NgayKy", mssql_1.default.Date, data.NgayKy)
            .input("NgayHetHan", mssql_1.default.Date, data.NgayHetHan || null)
            .input("LoaiDichVu", mssql_1.default.NVarChar(100), data.LoaiDichVu || null)
            .input("GiaTri", mssql_1.default.Decimal(15, 2), data.GiaTri || 0)
            .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai ?? "Hiệu lực")
            .input("MaHopDong", mssql_1.default.NVarChar(50), data.MaHopDong || null)
            .input("MoTa", mssql_1.default.NVarChar(500), data.MoTa || null)
            .input("FileHopDong", mssql_1.default.NVarChar(255), data.FileHopDong || null)
            .input("DieuKhoan", mssql_1.default.NVarChar(mssql_1.default.MAX), data.DieuKhoan || null)
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
        }
        else {
            warning = "Cảnh báo: Không có xe nào sẵn sàng. Container được tạo nhưng chưa gắn phương tiện.";
        }
        // 3. Get a default LoaiHangID to satisfy NOT NULL constraint
        const loaiHangRes = await request.query(`SELECT TOP 1 LoaiHangID FROM LoaiHang`);
        let loaiHangId = 1; // fallback
        if (loaiHangRes.recordset.length > 0) {
            loaiHangId = loaiHangRes.recordset[0].LoaiHangID;
        }
        // 4. Create Container
        const containerRes = await request
            .input("HopDongID_Container", mssql_1.default.Int, hopDongId)
            .input("PhuongTienID", mssql_1.default.Int, phuongTienId)
            .input("LoaiHangID", mssql_1.default.Int, loaiHangId)
            .query(`
        INSERT INTO Container (HopDongID, TrangThai, PhuongTienID, LoaiHangID, TrongLuong)
        OUTPUT INSERTED.ContainerID
        VALUES (@HopDongID_Container, N'Rỗng', @PhuongTienID, @LoaiHangID, 0)
      `);
        const containerId = containerRes.recordset[0].ContainerID;
        // 5. Create History Log
        await request
            .input("ContainerID_History", mssql_1.default.Int, containerId)
            .input("ThoiGian", mssql_1.default.DateTime, new Date())
            .input("HoatDong", mssql_1.default.NVarChar, 'Tạo')
            .input("TrangThaiCu", mssql_1.default.NVarChar, '')
            .input("TrangThaiMoi", mssql_1.default.NVarChar, 'Rỗng')
            .input("NguoiCapNhat", mssql_1.default.NVarChar, nguoiCapNhat)
            .query(`
        INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, TrangThaiCu, TrangThaiMoi, NguoiCapNhat)
        VALUES (@ContainerID_History, @ThoiGian, @HoatDong, @TrangThaiCu, @TrangThaiMoi, @NguoiCapNhat)
      `);
        await transaction.commit();
        return {
            success: true,
            message: "Thêm hợp đồng và tự động tạo Container (Rỗng) thành công.",
            warning: warning
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.workflowCreateContractWithContainer = workflowCreateContractWithContainer;
