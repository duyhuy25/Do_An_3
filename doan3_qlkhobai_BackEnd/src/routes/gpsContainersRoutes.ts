import express from "express";
import {
  getGpsContainers,
  addGpsContainer,
  updateGpsContainer,
  deleteGpsContainer,
  searchGpsContainer
} from "../controllers/gpsContainersController";

const router = express.Router();

router.get("/gps", getGpsContainers);
router.get("/gps/search", searchGpsContainer);
router.post("/gps", addGpsContainer);
router.put("/gps/:id", updateGpsContainer);
router.delete("/gps/:id", deleteGpsContainer);

export default router;
