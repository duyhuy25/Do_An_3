import {
  getAllInvoice,
  createInvoice,
  updateInvoiceById,
  deleteInvoiceById,
  searchInvoiceByKeyword
} from "../repositories/invoiceRepositories";

export const fetchInvoice = async () => {
  return await getAllInvoice();
};

export const addInvoiceService = async (data: any) => {
  return await createInvoice(data);
};

export const updateInvoiceService = async (id: number, data: any) => {
  return await updateInvoiceById(id, data);
};

export const deleteInvoiceService = async (id: number) => {
  return await deleteInvoiceById(id);
};

export const searchInvoiceService = async (keyword: string) => {
  return await searchInvoiceByKeyword(keyword);
};