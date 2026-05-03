"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suppliersController_1 = require("../controllers/suppliersController");
const router = express_1.default.Router();
router.get("/supplier", suppliersController_1.getSuppliers);
router.get("/supplier/search", suppliersController_1.searchSupplier);
router.post("/supplier", suppliersController_1.addSupplier);
router.put("/supplier/:id", suppliersController_1.updateSupplier);
router.delete("/supplier/:id", suppliersController_1.deleteSupplier);
exports.default = router;
