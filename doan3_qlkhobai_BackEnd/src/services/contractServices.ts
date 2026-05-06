import {
  getAllContract,
  createContract,
  updateContractById,
  deleteContractById,
  searchContractByKeyword
} from "../repositories/contractRepositories";
import { recalculateInvoiceTotal } from "../repositories/invoiceRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchContract = async () => {
  return await getAllContract();
};

export const addContractService = async (data: any) => {
  const result = await createContract(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Tạo hợp đồng mới (Mã: ${data.MaHopDong})`,
      Bang: "HopDong"
    });
  }
  return result;
};

export const updateContractService = async (id: number, data: any) => {
  const result = await updateContractById(id, data);
  await recalculateInvoiceTotal(id);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật hợp đồng ID: ${id}`,
      Bang: "HopDong"
    });
  }
  return result;
};

export const deleteContractService = async (id: number, userId?: number) => {
  const result = await deleteContractById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa hợp đồng ID: ${id}`,
      Bang: "HopDong"
    });
  }
  return result;
};

export const searchContractService = async (keyword: string) => {
  return await searchContractByKeyword(keyword);
};