import {
  getAllUser,
  createUser,
  updateUserById,
  deleteUserById,
  searchUserByKeyword,
  findUserByUsername,
} from "../repositories/usersRepositories";
import { createAuditLog } from "../repositories/auditLogRepositories";

export const fetchAllUsers = async () => {
  return await getAllUser();
};

export const addUserService = async (data: any) => {
  if (!data.Username || !data.RoleID) {
    throw new Error("Thiếu thông tin bắt buộc: Username, RoleID");
  }
  const result = await createUser(data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Thêm người dùng mới: ${data.Username}`,
      Bang: "Users"
    });
  }
  return result;
};

export const updateUserService = async (id: number, data: any) => {
  if (!data.RoleID) {
    data.RoleID = 1;  
  }
  const result = await updateUserById(id, data);
  if (data.UserID) {
    await createAuditLog({
      UserID: data.UserID,
      HanhDong: `Cập nhật người dùng ID: ${id}`,
      Bang: "Users"
    });
  }
  return result;
};

export const deleteUserService = async (id: number, userId?: number) => {
  const result = await deleteUserById(id);
  if (userId) {
    await createAuditLog({
      UserID: userId,
      HanhDong: `Xóa người dùng ID: ${id}`,
      Bang: "Users"
    });
  }
  return result;
};

export const searchUsersService = async (keyword: string) => {
  return await searchUserByKeyword(keyword);
};

export const loginService = async (username: string, password: string) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  // So sánh mật khẩu (hiện tại đang để text thuần nên so sánh trực tiếp)
  if (user.PasswordHash?.trim() !== password.trim()) {
    throw new Error("Mật khẩu không chính xác");
  }

  if (user.TrangThai === "Khóa") {
    throw new Error("Tài khoản đã bị khóa");
  }

  return user;
};