import { Router } from "express";
import { getWarehouses } from "../controllers/warehousesController";

const router = Router();

router.get("/warehouse", getWarehouses);

export default router;