import express from "express";
import {
  getContracts,
  addContract,
  updateContract,
  deleteContract,
  searchContracts
} from "../controllers/contractController";

const router = express.Router();

router.get("/contract", getContracts);
router.get("/contract/search", searchContracts);
router.post("/addcontract", addContract);
router.put("/contract/:id", updateContract);
router.delete("/contract/:id", deleteContract);

export default router;