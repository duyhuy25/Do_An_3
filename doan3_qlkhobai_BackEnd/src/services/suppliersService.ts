import {
  getAllSuppliers,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
  searchSupplierByKeyword
} from "../repositories/suppliersRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchSuppliers = async () => {
  return await getAllSuppliers();
};

export const addSupplierService = async (data: any) => {
  const result = await createSupplier(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm nhà cung cấp mới: ${data.TenNCC}`,
      Bang: "NhaCungCap"
    });
  }
  return result;
};

export const updateSupplierService = async (id: number, data: any) => {
  const result = await updateSupplierById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật nhà cung cấp ID: ${id}`,
      Bang: "NhaCungCap"
    });
  }
  return result;
};

export const deleteSupplierService = async (id: number, userId?: number) => {
  const result = await deleteSupplierById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa nhà cung cấp ID: ${id}`,
      Bang: "NhaCungCap"
    });
  }
  return result;
};

export const searchSupplierService = async (keyword: string) => {
  return await searchSupplierByKeyword(keyword);
};
