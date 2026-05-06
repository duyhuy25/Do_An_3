import {
  getAllCost,
  createCost,
  updateCostById,
  deleteCostById,
  searchCostByKeyword,
  getCostById
} from "../repositories/costRepositories";
import { recalculateInvoiceTotal } from "../repositories/invoiceRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchCost = async () => {
  return await getAllCost();
};

export const addCostService = async (data: any) => {
  const result = await createCost(data);
  if (data.HopDongID) {
    await recalculateInvoiceTotal(data.HopDongID);
  }

  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm chi phí mới: ${data.LoaiChiPhi}`,
      Bang: "ChiPhi"
    });
  }

  return result;
};

export const updateCostService = async (id: number, data: any) => {
  const result = await updateCostById(id, data);
  if (data.HopDongID) {
    await recalculateInvoiceTotal(data.HopDongID);
  }

  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật chi phí ID: ${id}`,
      Bang: "ChiPhi"
    });
  }

  return result;
};

export const deleteCostService = async (id: number, userId?: number) => {
  const cost = await getCostById(id);
  const result = await deleteCostById(id);
  if (cost && cost.HopDongID) {
    await recalculateInvoiceTotal(cost.HopDongID);
  }

  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa chi phí ID: ${id}`,
      Bang: "ChiPhi"
    });
  }

  return result;
};

export const searchCostService = async (keyword: string) => {
  return await searchCostByKeyword(keyword);
};