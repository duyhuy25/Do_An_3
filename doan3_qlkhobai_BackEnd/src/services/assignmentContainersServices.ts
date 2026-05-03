import {
  getAllAssignmentContainers,
  createAssignmentContainer,
  updateAssignmentContainerById,
  deleteAssignmentContainerById,
  searchAssignmentContainerByKeyword
} from "../repositories/assignmentContainers.Repositories";

export const fetchAssignmentContainers = async () => {
  return await getAllAssignmentContainers();
};

export const addAssignmentContainerService = async (data: any) => {
  return await createAssignmentContainer(data);
};

export const updateAssignmentContainerService = async (id: number, data: any) => {
  return await updateAssignmentContainerById(id, data);
};

export const deleteAssignmentContainerService = async (id: number) => {
  return await deleteAssignmentContainerById(id);
};

export const searchAssignmentContainerService = async (keyword: string) => {
  return await searchAssignmentContainerByKeyword(keyword);
};
