import {
  getAllUser,
  createUser,
  updateUserById,
  deleteUserById,
  searchUserByKeyword,
} from "../repositories/usersRepositories";

export const fetchAllUsers = async () => {
  return await getAllUser();
};

export const addUserService = async (data: any) => {
  if (!data.Username || !data.PasswordHash || !data.RoleID) {
    throw new Error("Thiếu thông tin bắt buộc: Username, PasswordHash, RoleID");
  }
  return await createUser(data);
};

export const updateUserService = async (id: number, data: any) => {
  if (!data.RoleID) {
    data.RoleID = 1;  
  }
  return await updateUserById(id, data);
};

export const deleteUserService = async (id: number) => {
  return await deleteUserById(id);
};

export const searchUsersService = async (keyword: string) => {
  return await searchUserByKeyword(keyword);
};