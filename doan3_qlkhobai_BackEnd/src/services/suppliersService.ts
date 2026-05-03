import {
  getAllSuppliers,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
  searchSupplierByKeyword
} from "../repositories/suppliersRepositories";

export const fetchSuppliers = async () => {
  return await getAllSuppliers();
};

export const addSupplierService = async (data: any) => {
  return await createSupplier(data);
};

export const updateSupplierService = async (id: number, data: any) => {
  return await updateSupplierById(id, data);
};

export const deleteSupplierService = async (id: number) => {
  return await deleteSupplierById(id);
};

export const searchSupplierService = async (keyword: string) => {
  return await searchSupplierByKeyword(keyword);
};
