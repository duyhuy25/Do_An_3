import { Request, Response } from "express";
import {
  fetchTrip,
  addTripService,
  updateTripService,
  deleteTripService,
  searchTripService
} from "../services/tripsServices";

export const getTrip = async (req: Request, res: Response) => {
  try {
    const data = await fetchTrip();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addTrip = async (req: Request, res: Response) => {
  try {
    await addTripService(req.body);
    res.json({ message: "Thêm chuyến đi thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateTripService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteTripService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchTrip = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchTripService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};