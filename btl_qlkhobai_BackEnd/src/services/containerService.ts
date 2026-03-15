import { getAllContainer } from "../repositories/containerRepository";

export const fetchContainer = async () => {
  return await getAllContainer();
};