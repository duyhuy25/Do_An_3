import {
  getAllTrip,
  createTrip,
  updateTripById,
  deleteTripById,
  searchTripByKeyword
} from "../repositories/tripsRepositories";

export const fetchTrip = async () => {
  return await getAllTrip();
};

export const addTripService = async (data: any) => {
  return await createTrip(data);
};

export const updateTripService = async (id: number, data: any) => {
  return await updateTripById(id, data);
};

export const deleteTripService = async (id: number) => {
  return await deleteTripById(id);
};

export const searchTripService = async (keyword: string) => {
  return await searchTripByKeyword(keyword);
};