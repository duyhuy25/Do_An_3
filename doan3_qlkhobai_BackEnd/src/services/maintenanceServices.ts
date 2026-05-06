import {
  getAllMaintenance,
  createMaintenance,
  updateMaintenanceById,
  deleteMaintenanceById,
  searchMaintenanceByKeyword
} from "../repositories/maintenanceRepositories";
import { updateVehicleStatus, getVehicleById } from "../repositories/vehicleRepositories";
import { createCost } from "../repositories/costRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchMaintenance = async () => {
  return await getAllMaintenance();
};

export const addMaintenanceService = async (data: any) => {
  const result = await createMaintenance(data);

  // Logic nghiệp vụ: Cập nhật trạng thái xe
  if (data.TrangThai === "Đang bảo trì") {
    await updateVehicleStatus(data.PhuongTienID, "Bảo trì");
  } else if (data.TrangThai === "Hoàn thành") {
    await updateVehicleStatus(data.PhuongTienID, "Sẵn sàng");
    // Tự động tạo chi phí nếu có giá tiền
    if (data.ChiPhi > 0) {
      const vehicle = await getVehicleById(data.PhuongTienID);
      await createCost({
        HopDongID: null,
        ContainerID: null,
        LoaiChiPhi: `Bảo trì xe ${vehicle?.BienSo || data.PhuongTienID}`,
        SoTien: data.ChiPhi,
        ThuKhachHang: "Không",
        NgayPhatSinh: data.NgayBaoTri || new Date(),
        TrangThaiThanhToan: "Đã thanh toán",
        NhaCungCap: data.NCCID ? data.NCCID.toString() : null
      });
    }
  }

  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm bảo trì xe (ID: ${data.PhuongTienID})`,
      Bang: "BaoTriPhuongTien"
    });
  }

  return result;
};

export const updateMaintenanceService = async (id: number, data: any) => {
  const result = await updateMaintenanceById(id, data);

  // Logic nghiệp vụ: Cập nhật trạng thái xe
  if (data.TrangThai === "Đang bảo trì") {
    await updateVehicleStatus(data.PhuongTienID, "Bảo trì");
  } else if (data.TrangThai === "Hoàn thành") {
    await updateVehicleStatus(data.PhuongTienID, "Sẵn sàng");

    // Tự động tạo chi phí nếu có giá tiền
    if (data.ChiPhi > 0) {
      const vehicle = await getVehicleById(data.PhuongTienID);
      await createCost({
        HopDongID: null,
        ContainerID: null,
        LoaiChiPhi: `Bảo trì xe ${vehicle?.BienSo || data.PhuongTienID}`,
        SoTien: data.ChiPhi,
        ThuKhachHang: "Không",
        NgayPhatSinh: data.NgayBaoTri || new Date(),
        TrangThaiThanhToan: "Đã thanh toán",
        NhaCungCap: data.NCCID ? data.NCCID.toString() : null
      });
    }
  }

  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật bảo trì ID: ${id} sang ${data.TrangThai}`,
      Bang: "BaoTriPhuongTien"
    });
  }

  return result;
};

export const deleteMaintenanceService = async (id: number) => {
  return await deleteMaintenanceById(id);
};

export const searchMaintenanceService = async (keyword: string) => {
  return await searchMaintenanceByKeyword(keyword);
};
