import { Request, Response } from "express";
import {
  fetchAuditLogs,
  addAuditLogService,
  updateAuditLogService,
  deleteAuditLogService,
  searchAuditLogService
} from "../services/auditLogServices";

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const data = await fetchAuditLogs();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addAuditLog = async (req: Request, res: Response) => {
  try {
    await addAuditLogService(req.body);
    res.json({ message: "Thêm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateAuditLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateAuditLogService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteAuditLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteAuditLogService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchAuditLog = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchAuditLogService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
