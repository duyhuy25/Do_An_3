import { Request, Response } from "express";
import {
  fetchAssignmentContainers,
  addAssignmentContainerService,
  updateAssignmentContainerService,
  deleteAssignmentContainerService,
  searchAssignmentContainerService
} from "../services/assignmentContainersServices";

export const getAssignmentContainers = async (req: Request, res: Response) => {
  try {
    const data = await fetchAssignmentContainers();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addAssignmentContainer = async (req: Request, res: Response) => {
  try {
    await addAssignmentContainerService(req.body);
    res.json({ message: "Thêm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateAssignmentContainer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateAssignmentContainerService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteAssignmentContainer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteAssignmentContainerService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchAssignmentContainer = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchAssignmentContainerService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
