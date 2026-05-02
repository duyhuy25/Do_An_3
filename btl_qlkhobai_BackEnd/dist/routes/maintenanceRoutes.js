"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const maintenanceController_1 = require("../controllers/maintenanceController");
const router = express_1.default.Router();
router.get("/maintenance", maintenanceController_1.getMaintenance);
router.get("/maintenance/search", maintenanceController_1.searchMaintenance);
router.post("/maintenance", maintenanceController_1.addMaintenance);
router.put("/maintenance/:id", maintenanceController_1.updateMaintenance);
router.delete("/maintenance/:id", maintenanceController_1.deleteMaintenance);
exports.default = router;
