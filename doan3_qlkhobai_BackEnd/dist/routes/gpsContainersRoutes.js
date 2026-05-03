"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gpsContainersController_1 = require("../controllers/gpsContainersController");
const router = express_1.default.Router();
router.get("/gps", gpsContainersController_1.getGpsContainers);
router.get("/gps/search", gpsContainersController_1.searchGpsContainer);
router.post("/gps", gpsContainersController_1.addGpsContainer);
router.put("/gps/:id", gpsContainersController_1.updateGpsContainer);
router.delete("/gps/:id", gpsContainersController_1.deleteGpsContainer);
exports.default = router;
