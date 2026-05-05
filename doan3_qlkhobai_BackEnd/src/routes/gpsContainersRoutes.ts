import express from "express";
import {
  getGpsContainers,
  addGpsContainer,
  updateGpsContainer,
  deleteGpsContainer,
  searchGpsContainer,
  getLatestGps
} from "../controllers/gpsContainersController";

const router = express.Router();

router.get("/gps", getGpsContainers);
router.get("/latest", getLatestGps);
router.get("/gps/search", searchGpsContainer);
router.post("/gps", addGpsContainer);
router.put("/gps/:id", updateGpsContainer);
router.delete("/gps/:id", deleteGpsContainer);

export default router;
