import {
  getAllContract,
  createContract,
  updateContractById,
  deleteContractById,
  searchContractByKeyword
} from "../repositories/contractRepositories";

export const fetchContract = async () => {
  return await getAllContract();
};

export const addContractService = async (data: any) => {
  return await createContract(data);
};

export const updateContractService = async (id: number, data: any) => {
  return await updateContractById(id, data);
};

export const deleteContractService = async (id: number) => {
  return await deleteContractById(id);
};

export const searchContractService = async (keyword: string) => {
  return await searchContractByKeyword(keyword);
};