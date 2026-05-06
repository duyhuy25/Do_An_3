import {
  getAllWarehouse,
  createWarehouse,
  updateWarehouseById,
  deleteWarehouseById,
  searchWarehouseByKeyword,
} from "../repositories/warehousesRepository";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchWarehouse = async () => {
  return await getAllWarehouse();
};

export const addWarehouseService = async (data: any) => {
  if (!data.TenKho) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  const result = await createWarehouse(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm kho mới: ${data.TenKho}`,
      Bang: "KhoLT"
    });
  }
  return result;
};

export const updateWarehouseService = async (id: number, data: any) => {
  const result = await updateWarehouseById(id, data);

  if (result.rowsAffected[0] === 0) {
    throw new Error("Không tìm thấy kho");
  }

  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật kho ID: ${id}`,
      Bang: "KhoLT"
    });
  }

  return result;
};

export const deleteWarehouseService = async (id: number, userId?: number) => {
  const result = await deleteWarehouseById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa kho ID: ${id}`,
      Bang: "KhoLT"
    });
  }
  return result;
};

export const searchWarehouseService = async (keyword: string) => {
  return await searchWarehouseByKeyword(keyword);
};