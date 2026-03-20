import { Request, Response } from "express";
import { fetchUser } from "../services/usersServices";

export const getUser = async (req: Request, res: Response) => {

  try {

    const data = await fetchUser();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};