import express from "express";
import {
  getCosts,
  addCost,
  updateCost,
  deleteCost,
  searchCosts
} from "../controllers/costController";

const router = express.Router();

router.get("/cost", getCosts);
router.get("/cost/search", searchCosts);
router.post("/addcost", addCost);
router.put("/cost/:id", updateCost);
router.delete("/cost/:id", deleteCost);

export default router;