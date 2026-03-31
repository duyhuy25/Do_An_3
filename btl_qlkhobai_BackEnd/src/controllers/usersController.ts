import { Request, Response } from "express";
import {
  fetchUser,
  addUserService,
  updateUserService,
  deleteUserService,
  searchUserService
} from "../services/usersServices";

export const getUser = async (req: Request, res: Response) => {
  try {
    const data = await fetchUser();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    await addUserService(req.body);
    res.json({ message: "Thêm user thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateUserService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteUserService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchUserService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};