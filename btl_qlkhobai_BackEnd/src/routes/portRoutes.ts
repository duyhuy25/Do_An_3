import { Router } from "express";
import { getPort } from "../controllers/portController";

const router = Router();

router.get("/port", getPort);

export default router;