import { getAllWarehouse } from "../repositories/warehousesRepository";

export const fetchWarehouse = async () => {
  return await getAllWarehouse();
};