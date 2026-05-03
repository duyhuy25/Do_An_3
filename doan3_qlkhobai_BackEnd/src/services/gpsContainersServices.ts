import {
  getAllGpsContainers,
  createGpsContainer,
  updateGpsContainerById,
  deleteGpsContainerById,
  searchGpsContainerByKeyword
} from "../repositories/gpsContainersRepositories";

export const fetchGpsContainers = async () => {
  return await getAllGpsContainers();
};

export const addGpsContainerService = async (data: any) => {
  return await createGpsContainer(data);
};

export const updateGpsContainerService = async (id: number, data: any) => {
  return await updateGpsContainerById(id, data);
};

export const deleteGpsContainerService = async (id: number) => {
  return await deleteGpsContainerById(id);
};

export const searchGpsContainerService = async (keyword: string) => {
  return await searchGpsContainerByKeyword(keyword);
};
