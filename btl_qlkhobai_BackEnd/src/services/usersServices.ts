import {
  getAllUser,
  createUser,
  updateUserById,
  deleteUserById,
  searchUserByKeyword
} from "../repositories/usersRepositories";

export const fetchUser = async () => {
  return await getAllUser();
};

export const addUserService = async (data: any) => {
  return await createUser(data);
};

export const updateUserService = async (id: number, data: any) => {
  return await updateUserById(id, data);
};

export const deleteUserService = async (id: number) => {
  return await deleteUserById(id);
};

export const searchUserService = async (keyword: string) => {
  return await searchUserByKeyword(keyword);
};