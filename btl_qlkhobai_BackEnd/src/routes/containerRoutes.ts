import { Router } from "express";
import { getContainers, deleteContainer } from "../controllers/containerController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.get(
  "/",
  authenticate,
  getContainers
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteContainer
);

export default router;