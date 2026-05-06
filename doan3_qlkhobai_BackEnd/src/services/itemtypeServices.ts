import {
  getAllItemtype,
  createItemtype,
  updateItemtypeById,
  deleteItemtypeById,
  searchItemtypeByKeyword
} from "../repositories/itemtypeRepository";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchItemType = async () => {
  return await getAllItemtype();
};

export const addItemTypeService = async (data: any) => {
  const result = await createItemtype(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm loại hàng mới: ${data.TenLoai}`,
      Bang: "LoaiHang"
    });
  }
  return result;
};

export const updateItemTypeService = async (id: number, data: any) => {
  const result = await updateItemtypeById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật loại hàng ID: ${id}`,
      Bang: "LoaiHang"
    });
  }
  return result;
};

export const deleteItemTypeService = async (id: number, userId?: number) => {
  const result = await deleteItemtypeById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa loại hàng ID: ${id}`,
      Bang: "LoaiHang"
    });
  }
  return result;
};

export const searchItemTypeService = async (keyword: string) => {
  return await searchItemtypeByKeyword(keyword);
};