import {
  getAllContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  searchContainer,          
} from "../repositories/containerRepository";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchContainer = async () => {
  return await getAllContainer();
};

export const createContainerService = async (data: any) => {
  const result = await createContainer(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm container mới: ${data.MaContainer || result.ContainerID}`,
      Bang: "Container"
    });
  }
  return result;
};

export const updateContainerService = async (id: number, data: any) => {
  const result = await updateContainer(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật container ID: ${id}`,
      Bang: "Container"
    });
  }
  return result;
};

export const deleteContainerService = async (id: number, userId?: number) => {
  const result = await deleteContainer(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa container ID: ${id}`,
      Bang: "Container"
    });
  }
  return result;
};

export const searchContainersService = async (searchTerm: string = "") => {
  return await searchContainer(searchTerm);
};