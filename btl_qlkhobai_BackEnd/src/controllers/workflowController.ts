import { Request, Response } from "express";
import {
  workflowStartPacking,
  workflowFinishPacking,
  workflowEnterWarehouse,
  workflowStartTransport,
  workflowVehicleArrived,
  workflowDeliverContainer,
  workflowCancelContainer
} from "../services/workflowServices";

export const startPacking = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { nguoiCapNhat } = req.body;
    
    if (isNaN(containerId)) {
      res.status(400).json({ success: false, message: "Invalid Container ID" });
      return;
    }

    const result = await workflowStartPacking(containerId, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const finishPacking = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { nguoiCapNhat } = req.body;
    
    if (isNaN(containerId)) {
      res.status(400).json({ success: false, message: "Invalid Container ID" });
      return;
    }

    const result = await workflowFinishPacking(containerId, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const enterWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { khoId, nguoiCapNhat } = req.body;
    
    if (isNaN(containerId) || !khoId) {
      res.status(400).json({ success: false, message: "Invalid Container ID or Kho ID" });
      return;
    }

    const result = await workflowEnterWarehouse(containerId, khoId, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { chuyenDiId, phuongTienId, khoIdCu, nguoiCapNhat } = req.body;
    
    if (isNaN(containerId) || !chuyenDiId || !phuongTienId) {
      res.status(400).json({ success: false, message: "Missing required parameters" });
      return;
    }

    const result = await workflowStartTransport(containerId, chuyenDiId, phuongTienId, khoIdCu, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const vehicleArrived = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { chuyenDiId, phuongTienId, nguoiCapNhat } = req.body;
    
    if (isNaN(containerId)) {
      res.status(400).json({ success: false, message: "Invalid Container ID" });
      return;
    }

    const result = await workflowVehicleArrived(containerId, chuyenDiId, phuongTienId, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deliverContainer = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { nguoiCapNhat } = req.body;
    
    if (isNaN(containerId)) {
      res.status(400).json({ success: false, message: "Invalid Container ID" });
      return;
    }

    const result = await workflowDeliverContainer(containerId, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelContainer = async (req: Request, res: Response): Promise<void> => {
  try {
    const containerId = Number(req.params.containerId);
    const { nguoiCapNhat } = req.body;
    
    if (isNaN(containerId)) {
      res.status(400).json({ success: false, message: "Invalid Container ID" });
      return;
    }

    const result = await workflowCancelContainer(containerId, nguoiCapNhat);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
