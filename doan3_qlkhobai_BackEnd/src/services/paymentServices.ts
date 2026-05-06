import {
  getPaymentsByInvoiceId,
  createPayment,
  deletePaymentById
} from "../repositories/paymentRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchPaymentsByInvoiceIdService = async (hoaDonId: number) => {
  return await getPaymentsByInvoiceId(hoaDonId);
};

export const addPaymentService = async (data: any) => {
  const result = await createPayment(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm thanh toán cho hóa đơn ID: ${data.HoaDonID}`,
      Bang: "ThanhToan"
    });
  }
  return result;
};

export const removePaymentService = async (id: number, userId?: number) => {
  const result = await deletePaymentById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa thanh toán ID: ${id}`,
      Bang: "ThanhToan"
    });
  }
  return result;
};
