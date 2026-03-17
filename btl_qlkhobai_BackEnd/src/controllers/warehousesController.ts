import { Request, Response } from "express";
import { fetchWarehouse } from "../services/warehouseServices";

export const getWarehouses = async (req: Request, res: Response) => {

  try {

    const data = await fetchWarehouse();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};