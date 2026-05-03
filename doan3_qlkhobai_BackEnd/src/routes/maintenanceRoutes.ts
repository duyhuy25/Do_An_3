import express from "express";
import {
  getMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  searchMaintenance
} from "../controllers/maintenanceController";

const router = express.Router();

router.get("/maintenance", getMaintenance);
router.get("/maintenance/search", searchMaintenance);
router.post("/maintenance", addMaintenance);
router.put("/maintenance/:id", updateMaintenance);
router.delete("/maintenance/:id", deleteMaintenance);

export default router;
