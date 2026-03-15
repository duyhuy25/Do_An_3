import { Router } from "express";
import { getContainers } from "../controllers/containerController";

const router = Router();

router.get("/container", getContainers);

export default router;