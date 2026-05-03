import { Request, Response } from "express";
import {
  fetchCost,
  addCostService,
  updateCostService,
  deleteCostService,
  searchCostService
} from "../services/costServices";

export const getCosts = async (req: Request, res: Response) => {
  try {
    const data = await fetchCost();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addCost = async (req: Request, res: Response) => {
  try {
    await addCostService(req.body);
    res.json({ message: "Thêm chi phí thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateCost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateCostService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteCost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteCostService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchCosts = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    const data = await searchCostService(keyword);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};