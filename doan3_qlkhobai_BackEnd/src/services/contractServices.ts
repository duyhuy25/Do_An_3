import {
  getAllContract,
  createContract,
  updateContractById,
  deleteContractById,
  searchContractByKeyword
} from "../repositories/contractRepositories";
import { recalculateInvoiceTotal } from "../repositories/invoiceRepositories";

export const fetchContract = async () => {
  return await getAllContract();
};

export const addContractService = async (data: any) => {
  return await createContract(data);
};

export const updateContractService = async (id: number, data: any) => {
  const result = await updateContractById(id, data);
  await recalculateInvoiceTotal(id);
  return result;
};

export const deleteContractService = async (id: number) => {
  return await deleteContractById(id);
};

export const searchContractService = async (keyword: string) => {
  return await searchContractByKeyword(keyword);
};