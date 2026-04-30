import express from "express";
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  searchSupplier
} from "../controllers/suppliersController";

const router = express.Router();

router.get("/supplier", getSuppliers);
router.get("/supplier/search", searchSupplier);
router.post("/supplier", addSupplier);
router.put("/supplier/:id", updateSupplier);
router.delete("/supplier/:id", deleteSupplier);

export default router;
