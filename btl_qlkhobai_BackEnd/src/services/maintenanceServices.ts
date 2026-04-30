import {
  getAllMaintenance,
  createMaintenance,
  updateMaintenanceById,
  deleteMaintenanceById,
  searchMaintenanceByKeyword
} from "../repositories/maintenanceRepositories";

export const fetchMaintenance = async () => {
  return await getAllMaintenance();
};

export const addMaintenanceService = async (data: any) => {
  return await createMaintenance(data);
};

export const updateMaintenanceService = async (id: number, data: any) => {
  return await updateMaintenanceById(id, data);
};

export const deleteMaintenanceService = async (id: number) => {
  return await deleteMaintenanceById(id);
};

export const searchMaintenanceService = async (keyword: string) => {
  return await searchMaintenanceByKeyword(keyword);
};
