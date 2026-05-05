import { Request, Response } from "express";
import {
  fetchGpsContainers,
  addGpsContainerService,
  updateGpsContainerService,
  deleteGpsContainerService,
  searchGpsContainerService,
  fetchLatestGpsService
} from "../services/gpsContainersServices";

export const getGpsContainers = async (req: Request, res: Response) => {
  try {
    const data = await fetchGpsContainers();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getLatestGps = async (req: Request, res: Response) => {
  try {
    const data = await fetchLatestGpsService();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addGpsContainer = async (req: Request, res: Response) => {
  try {
    await addGpsContainerService(req.body);
    res.json({ message: "Thêm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateGpsContainer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateGpsContainerService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteGpsContainer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteGpsContainerService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchGpsContainer = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchGpsContainerService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
