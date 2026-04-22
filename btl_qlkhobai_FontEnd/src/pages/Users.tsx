import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface User {
  UserID: number;
  Username: string;
  PasswordHash: string;
  HoTen: string;
  Email: string;
  TrangThai: string;
  RoleID: number;
  TenVaiTro?: string;

  SDT: string;
  DiaChi: string;
  NgaySinh: string;
  GioiTinh: string;
  Avatar: string;
}

interface Role {
  RoleID: number;
  TenVaiTro: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const [form, setForm] = useState({
    Username: "",
    PasswordHash: "",
    HoTen: "",
    Email: "",
    TrangThai: "Hoạt động",
    RoleID: "1",

    SDT: "",
    DiaChi: "",
    NgaySinh: "",
    GioiTinh: "Nam",
    Avatar: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/user/user/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/user/user`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách");

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/role/role");
      const data = await res.json();
      setRoles(data);
    } catch {
      console.error("Lỗi load role");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  const formatID = (id: number) => "USR" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      Username: "",
      PasswordHash: "",
      HoTen: "",
      Email: "",
      TrangThai: "Hoạt động",
      RoleID: "1",
      SDT: "",
      DiaChi: "",
      NgaySinh: "",
      GioiTinh: "Nam",
      Avatar: ""
    });

    setShowPassword(false);
    setShowForm(true);
  };

  const handleOpenEdit = (u: User) => {
    setIsEdit(true);
    setSelected(u);

    setForm({
      Username: u.Username,
      PasswordHash: "",
      HoTen: u.HoTen || "",
      Email: u.Email || "",
      TrangThai: u.TrangThai || "Hoạt động",
      RoleID: u.RoleID.toString(),

      SDT: u.SDT || "",
      DiaChi: u.DiaChi || "",
      NgaySinh: u.NgaySinh ? u.NgaySinh.split("T")[0] : "",
      GioiTinh: u.GioiTinh || "Nam",
      Avatar: u.Avatar || ""
    });

    setShowPassword(false);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.Username || !form.HoTen || !form.RoleID) {
      alert("Thiếu thông tin bắt buộc!");
      return;
    }

    if (!isEdit && !form.PasswordHash) {
      alert("Phải nhập mật khẩu!");
      return;
    }

    if (form.Email && !form.Email.includes("@")) {
      alert("Email không hợp lệ!");
      return;
    }

    const payload: any = {
      Username: form.Username,
      HoTen: form.HoTen,
      Email: form.Email || null,
      TrangThai: form.TrangThai,
      RoleID: Number(form.RoleID),

      SDT: form.SDT || null,
      DiaChi: form.DiaChi || null,
      NgaySinh: form.NgaySinh || null,
      GioiTinh: form.GioiTinh,
      Avatar: form.Avatar || null
    };

    if (form.PasswordHash) payload.PasswordHash = form.PasswordHash;

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/user/user/${selected.UserID}`
        : `http://localhost:5000/api/user/adduser`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Thành công!");
      setShowForm(false);
      fetchUsers(search);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa?")) return;

    await fetch(`http://localhost:5000/api/user/user/${id}`, {
      method: "DELETE"
    });

    fetchUsers(search);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>👤 Người dùng</h2>

        <div className="toolbar">
          <input
            className="search"
            placeholder="🔍 Tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.UserID} onClick={() => handleOpenEdit(u)}>
              <td>{formatID(u.UserID)}</td>

              <td>
                {u.Avatar ? (
                  <img src={u.Avatar} width="40" style={{ borderRadius: "50%" }} />
                ) : "👤"}
              </td>

              <td>{u.Username}</td>
              <td>{u.HoTen}</td>
              <td>{u.Email || "-"}</td>
              <td>{u.SDT || "-"}</td>
              <td>{u.TenVaiTro || u.RoleID}</td>
              <td>{u.TrangThai}</td>

              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(u); }}>Sửa</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(u.UserID); }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} user</h3>

            <input name="Username" disabled={isEdit} value={form.Username} onChange={handleChange} placeholder="Username" />

            <input type={showPassword ? "text" : "password"} name="PasswordHash" value={form.PasswordHash} onChange={handleChange} placeholder="Mật khẩu" />
            <button onClick={() => setShowPassword(!showPassword)}>👁</button>

            <input name="HoTen" value={form.HoTen} onChange={handleChange} placeholder="Họ tên" />
            <input name="Email" value={form.Email} onChange={handleChange} placeholder="Email" />
            <input name="SDT" value={form.SDT} onChange={handleChange} placeholder="SĐT" />
            <input name="DiaChi" value={form.DiaChi} onChange={handleChange} placeholder="Địa chỉ" />

            <input type="date" name="NgaySinh" value={form.NgaySinh} onChange={handleChange} />

            <select name="GioiTinh" value={form.GioiTinh} onChange={handleChange}>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>

            <input name="Avatar" value={form.Avatar} onChange={handleChange} placeholder="Link avatar" />

            {form.Avatar && <img src={form.Avatar} width="60" />}

            <select name="RoleID" value={form.RoleID} onChange={handleChange}>
              {roles.map(r => (
                <option key={r.RoleID} value={r.RoleID}>
                  {r.TenVaiTro}
                </option>
              ))}
            </select>

            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option>Hoạt động</option>
              <option>Khóa</option>
              <option>Chờ duyệt</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSubmit}>Lưu</button>
              <button onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;