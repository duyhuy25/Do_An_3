import { Router } from "express";
import {
  startPacking,
  finishPacking,
  enterWarehouse,
  startTransport,
  vehicleArrived,
  deliverContainer,
  cancelContainer
} from "../controllers/workflowController";

const router = Router();

router.post("/start-packing/:containerId", startPacking);
router.post("/finish-packing/:containerId", finishPacking);
router.post("/enter-warehouse/:containerId", enterWarehouse);
router.post("/start-transport/:containerId", startTransport);
router.post("/vehicle-arrived/:containerId", vehicleArrived);
router.post("/deliver-container/:containerId", deliverContainer);
router.post("/cancel-container/:containerId", cancelContainer);

export default router;
