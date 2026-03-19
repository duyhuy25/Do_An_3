import { getAllPort } from "../repositories/portRepositories";

export const fetchPort = async () => {
  return await getAllPort();
};