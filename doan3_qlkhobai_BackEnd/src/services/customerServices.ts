import {
  getAllCustomer,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
  searchCustomerByKeyword
} from "../repositories/customerRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchCustomer = async () => {
  return await getAllCustomer();
};

export const addCustomerService = async (data: any) => {
  const result = await createCustomer(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm khách hàng mới: ${data.TenKH}`,
      Bang: "KhachHang"
    });
  }
  return result;
};

export const updateCustomerService = async (id: number, data: any) => {
  const result = await updateCustomerById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật khách hàng ID: ${id}`,
      Bang: "KhachHang"
    });
  }
  return result;
};

export const deleteCustomerService = async (id: number, userId?: number) => {
  const result = await deleteCustomerById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa khách hàng ID: ${id}`,
      Bang: "KhachHang"
    });
  }
  return result;
};

export const searchCustomerService = async (keyword: string) => {
  return await searchCustomerByKeyword(keyword);
};