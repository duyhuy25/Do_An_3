import { Request, Response } from "express";
import {
  fetchInvoice,
  addInvoiceService,
  updateInvoiceService,
  deleteInvoiceService,
  searchInvoiceService
} from "../services/invoiceServices";

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const data = await fetchInvoice();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addInvoice = async (req: Request, res: Response) => {
  try {
    await addInvoiceService(req.body);
    res.json({ message: "Thêm hóa đơn thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

  export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateInvoiceService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteInvoiceService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchInvoice = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchInvoiceService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};