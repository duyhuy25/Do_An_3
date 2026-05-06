import {
  getAllPort,
  createPort,
  updatePortById,
  deletePortById,
  searchPortByKeyword
} from "../repositories/portRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchPort = async () => {
  return await getAllPort();
};

export const addPortService = async (data: any) => {
  const result = await createPort(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm cảng mới: ${data.TenCang}`,
      Bang: "Cang"
    });
  }
  return result;
};

export const updatePortService = async (id: number, data: any) => {
  const result = await updatePortById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật cảng ID: ${id}`,
      Bang: "Cang"
    });
  }
  return result;
};

export const deletePortService = async (id: number, userId?: number) => {
  const result = await deletePortById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa cảng ID: ${id}`,
      Bang: "Cang"
    });
  }
  return result;
};

export const searchPortService = async (keyword: string) => {
  return await searchPortByKeyword(keyword);
};