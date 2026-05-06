import {
  getAllTrip,
  createTrip,
  updateTripById,
  deleteTripById,
  searchTripByKeyword
} from "../repositories/tripsRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchTrip = async () => {
  return await getAllTrip();
};

export const addTripService = async (data: any) => {
  const result = await createTrip(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm chuyến đi mới: ${data.MaChuyen}`,
      Bang: "ChuyenDi"
    });
  }
  return result;
};

export const updateTripService = async (id: number, data: any) => {
  const result = await updateTripById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật chuyến đi ID: ${id}`,
      Bang: "ChuyenDi"
    });
  }
  return result;
};

export const deleteTripService = async (id: number, userId?: number) => {
  const result = await deleteTripById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa chuyến đi ID: ${id}`,
      Bang: "ChuyenDi"
    });
  }
  return result;
};

export const searchTripService = async (keyword: string) => {
  return await searchTripByKeyword(keyword);
};