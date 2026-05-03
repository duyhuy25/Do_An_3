import {
  getAllCost,
  createCost,
  updateCostById,
  deleteCostById,
  searchCostByKeyword,
  getCostById
} from "../repositories/costRepositories";
import { recalculateInvoiceTotal } from "../repositories/invoiceRepositories";

export const fetchCost = async () => {
  return await getAllCost();
};

export const addCostService = async (data: any) => {
  const result = await createCost(data);
  if (data.HopDongID) {
    await recalculateInvoiceTotal(data.HopDongID);
  }
  return result;
};

export const updateCostService = async (id: number, data: any) => {
  const result = await updateCostById(id, data);
  if (data.HopDongID) {
    await recalculateInvoiceTotal(data.HopDongID);
  }
  return result;
};

export const deleteCostService = async (id: number) => {
  const cost = await getCostById(id);
  const result = await deleteCostById(id);
  if (cost && cost.HopDongID) {
    await recalculateInvoiceTotal(cost.HopDongID);
  }
  return result;
};

export const searchCostService = async (keyword: string) => {
  return await searchCostByKeyword(keyword);
};