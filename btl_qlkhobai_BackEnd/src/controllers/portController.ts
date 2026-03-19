import { Request, Response } from "express";
import { fetchPort } from "../services/portServices";

export const getPort = async (req: Request, res: Response) => {

  try {

    const data = await fetchPort();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};