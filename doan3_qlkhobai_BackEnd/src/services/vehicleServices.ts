import {
  getAllVehicle,
  createVehicle,
  updateVehicleById,
  deleteVehicleById,
  searchVehicleByKeyword,
} from "../repositories/vehicleRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchVehicle = async () => {
  return await getAllVehicle();
};

export const addVehicleService = async (data: any) => {
  if (!data.LoaiPhuongTien || !data.BienSo) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  const result = await createVehicle(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm phương tiện mới: ${data.BienSo}`,
      Bang: "PhuongTien"
    });
  }
  return result;
};

export const updateVehicleService = async (id: number, data: any) => {
  const result = await updateVehicleById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật phương tiện ID: ${id}`,
      Bang: "PhuongTien"
    });
  }
  return result;
};

export const deleteVehicleService = async (id: number, userId?: number) => {
  const result = await deleteVehicleById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa phương tiện ID: ${id}`,
      Bang: "PhuongTien"
    });
  }
  return result;
};

export const searchVehicleService = async (keyword: string) => {
  return await searchVehicleByKeyword(keyword);
};