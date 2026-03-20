import { getAllUser } from "../repositories/usersRepositories";

export const fetchUser = async () => {
  return await getAllUser();
};