import {
  getAllCost,
  createCost,
  updateCostById,
  deleteCostById,
  searchCostByKeyword
} from "../repositories/costRepositories";

export const fetchCost = async () => {
  return await getAllCost();
};

export const addCostService = async (data: any) => {
  return await createCost(data);
};

export const updateCostService = async (id: number, data: any) => {
  return await updateCostById(id, data);
};

export const deleteCostService = async (id: number) => {
  return await deleteCostById(id);
};

export const searchCostService = async (keyword: string) => {
  return await searchCostByKeyword(keyword);
};