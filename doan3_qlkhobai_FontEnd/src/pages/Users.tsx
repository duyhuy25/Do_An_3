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
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: number]: boolean }>({});

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

  const fetchUsers = useCallback(async (searchTerm: string = "") => {
    try {

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/user/user/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/user/user`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách");

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
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
    setLoading(true);
    Promise.all([fetchUsers(), fetchRoles()]).finally(() => setLoading(false));
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
      PasswordHash: u.PasswordHash || "",
      HoTen: u.HoTen || "",
      Email: u.Email || "",
      TrangThai: u.TrangThai || "Hoạt động",
      RoleID: u.RoleID ? u.RoleID.toString() : "1",

      SDT: u.SDT || "",
      DiaChi: u.DiaChi || "",
      NgaySinh: u.NgaySinh ? u.NgaySinh.split("T")[0] : "",
      GioiTinh: u.GioiTinh || "Nam",
      Avatar: u.Avatar || ""
    });

    setShowPassword(false);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, Avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.Username.trim() || form.Username.trim().length < 3) {
      alert("Username phải có ít nhất 3 ký tự!");
      return;
    }

    if (!isEdit && (!form.PasswordHash || form.PasswordHash.length < 6)) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!form.HoTen.trim()) {
      alert("Họ tên không được để trống!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.Email && !emailRegex.test(form.Email)) {
      alert("Email không hợp lệ!");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (form.SDT && !phoneRegex.test(form.SDT)) {
      alert("Số điện thoại không hợp lệ!");
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
      Avatar: form.Avatar || null,
      UserID: currentUser.UserID
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

    await fetch(`http://localhost:5000/api/user/user/${id}?userId=${currentUser.UserID}`, {
      method: "DELETE"
    });

    fetchUsers(search);
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {loading && <div className="loading">Đang tải...</div>}
      <div className="header">
        <h2>👤 Người dùng</h2>

        <div className="toolbar">
          <input
            className="search"
            placeholder="🔍 Tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
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
            <th>Mật khẩu</th>
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
                  <img src={u.Avatar} width="40" style={{ borderRadius: "0px" }} />
                ) : "👤"}
              </td>

              <td>{u.Username}</td>
              <td>{u.HoTen}</td>
              <td>{u.Email || "-"}</td>
              <td>{u.SDT || "-"}</td>
               <td>{u.TenVaiTro || u.RoleID}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{visiblePasswords[u.UserID] ? (u.PasswordHash || "N/A") : "••••••••"}</span>
                  <button 
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisiblePasswords(prev => ({ ...prev, [u.UserID]: !prev[u.UserID] }));
                    }}
                  >
                    {visiblePasswords[u.UserID] ? "🔒" : "👁️"}
                  </button>
                </div>
              </td>
              <td>{u.TrangThai}</td>

              <td className="actions">
              <div className="td-actions">
                <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(u); }}>Sửa</button>
                <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(u.UserID); }}>Xóa</button>
              </div>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} user</h3>

            <label>Username</label>
            <input
              name="Username"
              disabled={isEdit}
              value={form.Username}
              onChange={handleChange}
              placeholder="Username"
              autoComplete="off"
            />

            <label>Mật khẩu</label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="PasswordHash"
                value={form.PasswordHash}
                onChange={handleChange}
                placeholder="Mật khẩu"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                👁
              </button>
            </div>

            <label>Họ tên</label>
            <input name="HoTen" value={form.HoTen} onChange={handleChange} />

            <label>Email</label>
            <input name="Email" value={form.Email} onChange={handleChange} />

            <label>Số điện thoại</label>
            <input name="SDT" value={form.SDT} onChange={handleChange} />

            <label>Địa chỉ</label>
            <input name="DiaChi" value={form.DiaChi} onChange={handleChange} />

            <label>Ngày sinh</label>
            <input type="date" name="NgaySinh" value={form.NgaySinh} onChange={handleChange} />

            <label>Giới tính</label>
            <select name="GioiTinh" value={form.GioiTinh} onChange={handleChange}>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>

            <label>Avatar</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input name="Avatar" value={form.Avatar} onChange={handleChange} placeholder="Link avatar" style={{ flex: 1 }} />
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: "100px" }} />
            </div>

            {form.Avatar && <img src={form.Avatar} width="60" />}

            <label>Vai trò</label>
            <select name="RoleID" value={form.RoleID} onChange={handleChange}>
              {roles.map(r => (
                <option key={r.RoleID} value={r.RoleID}>
                  {r.TenVaiTro}
                </option>
              ))}
            </select>

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option>Hoạt động</option>
              <option>Khóa</option>
              <option>Chờ duyệt</option>
            </select>

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>
                {isEdit ? "Cập nhật" : "Thêm"}
              </button>

              <button
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;