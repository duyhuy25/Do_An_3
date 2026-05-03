import express from "express";
import {
  getTrip,
  addTrip,
  updateTrip,
  deleteTrip,
  searchTrip
} from "../controllers/tripsController";

const router = express.Router();

router.get("/trip", getTrip);
router.get("/trip/search", searchTrip);
router.post("/addtrip", addTrip);
router.put("/trip/:id", updateTrip);
router.delete("/trip/:id", deleteTrip);

export default router;