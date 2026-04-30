import { Request, Response } from "express";
import {
  fetchSuppliers,
  addSupplierService,
  updateSupplierService,
  deleteSupplierService,
  searchSupplierService
} from "../services/suppliersService";

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const data = await fetchSuppliers();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addSupplier = async (req: Request, res: Response) => {
  try {
    await addSupplierService(req.body);
    res.json({ message: "Thêm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateSupplierService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteSupplierService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchSupplier = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchSupplierService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
