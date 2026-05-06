import {
  getAllInvoice,
  createInvoice,
  updateInvoiceById,
  deleteInvoiceById,
  searchInvoiceByKeyword
} from "../repositories/invoiceRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchInvoice = async () => {
  return await getAllInvoice();
};

export const addInvoiceService = async (data: any) => {
  const result = await createInvoice(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Tạo hóa đơn mới cho hợp đồng ID: ${data.HopDongID}`,
      Bang: "HoaDon"
    });
  }
  return result;
};

export const updateInvoiceService = async (id: number, data: any) => {
  const result = await updateInvoiceById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật hóa đơn ID: ${id}`,
      Bang: "HoaDon"
    });
  }
  return result;
};

export const deleteInvoiceService = async (id: number, userId?: number) => {
  const result = await deleteInvoiceById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa hóa đơn ID: ${id}`,
      Bang: "HoaDon"
    });
  }
  return result;
};

export const searchInvoiceService = async (keyword: string) => {
  return await searchInvoiceByKeyword(keyword);
};