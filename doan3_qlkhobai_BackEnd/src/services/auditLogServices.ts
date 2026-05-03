import {
  getAllAuditLogs,
  createAuditLog,
  updateAuditLogById,
  deleteAuditLogById,
  searchAuditLogByKeyword
} from "../repositories/auditLogRepositories";

export const fetchAuditLogs = async () => {
  return await getAllAuditLogs();
};

export const addAuditLogService = async (data: any) => {
  return await createAuditLog(data);
};

export const updateAuditLogService = async (id: number, data: any) => {
  return await updateAuditLogById(id, data);
};

export const deleteAuditLogService = async (id: number) => {
  return await deleteAuditLogById(id);
};

export const searchAuditLogService = async (keyword: string) => {
  return await searchAuditLogByKeyword(keyword);
};
