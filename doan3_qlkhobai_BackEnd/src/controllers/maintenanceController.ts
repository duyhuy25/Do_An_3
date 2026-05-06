import { Request, Response } from "express";
import {
  fetchMaintenance,
  addMaintenanceService,
  updateMaintenanceService,
  deleteMaintenanceService,
  searchMaintenanceService
} from "../services/maintenanceServices";

export const getMaintenance = async (req: Request, res: Response) => {
  try {
    const data = await fetchMaintenance();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addMaintenance = async (req: Request, res: Response) => {
  try {
    await addMaintenanceService(req.body);
    res.json({ message: "Thêm thành công" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

export const updateMaintenance = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateMaintenanceService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

export const deleteMaintenance = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteMaintenanceService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchMaintenance = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchMaintenanceService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
