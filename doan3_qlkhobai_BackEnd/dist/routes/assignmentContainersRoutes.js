"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignmentContainersController_1 = require("../controllers/assignmentContainersController");
const router = express_1.default.Router();
router.get("/assignment", assignmentContainersController_1.getAssignmentContainers);
router.get("/assignment/search", assignmentContainersController_1.searchAssignmentContainer);
router.post("/assignment", assignmentContainersController_1.addAssignmentContainer);
router.put("/assignment/:id", assignmentContainersController_1.updateAssignmentContainer);
router.delete("/assignment/:id", assignmentContainersController_1.deleteAssignmentContainer);
exports.default = router;
