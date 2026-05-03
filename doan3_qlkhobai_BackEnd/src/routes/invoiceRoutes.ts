import express from "express";
import {
  getInvoice,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  searchInvoice
} from "../controllers/invoiceController";

const router = express.Router();

router.get("/invoice", getInvoice);
router.get("/invoice/search", searchInvoice);
router.post("/addinvoice", addInvoice);
router.put("/invoice/:id", updateInvoice);
router.delete("/invoice/:id", deleteInvoice);

export default router;