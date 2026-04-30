import express from "express";
import {
  getAssignmentContainers,
  addAssignmentContainer,
  updateAssignmentContainer,
  deleteAssignmentContainer,
  searchAssignmentContainer
} from "../controllers/assignmentContainersController";

const router = express.Router();

router.get("/assignment", getAssignmentContainers);
router.get("/assignment/search", searchAssignmentContainer);
router.post("/assignment", addAssignmentContainer);
router.put("/assignment/:id", updateAssignmentContainer);
router.delete("/assignment/:id", deleteAssignmentContainer);

export default router;
