import React, { useEffect, useState } from "react";
import "./Pages.css";

interface User {
  UserID: number;
  Username: string;
  PasswordHash: string;
  HoTen: string;
  Email: string;
  TrangThai: string;
  RoleID: number;
}

const Users: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const [form, setForm] = useState({
    Username: "",
    PasswordHash: "",
    HoTen: "",
    Email: "",
    TrangThai: "",
    RoleID: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/user/user");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "USR" + id.toString().padStart(3, "0");

  const filtered = users.filter((u) =>
    u.HoTen.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      Username: "",
      PasswordHash: "",
      HoTen: "",
      Email: "",
      TrangThai: "",
      RoleID: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: User) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      Username: item.Username,
      PasswordHash: item.PasswordHash,
      HoTen: item.HoTen,
      Email: item.Email,
      TrangThai: item.TrangThai,
      RoleID: item.RoleID.toString()
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      RoleID: Number(form.RoleID)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/user/user/${selected.UserID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/user/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`http://localhost:5000/api/user/user/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>👤 Danh sách người dùng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm người dùng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm người dùng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tài khoản</th>
            <th>Mật khẩu</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Vai trò</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => (
            <tr key={u.UserID} onClick={() => handleOpenEdit(u)}>
              <td>{formatID(u.UserID)}</td>
              <td>{u.Username}</td>
              <td>{u.PasswordHash}</td>
              <td>{u.HoTen}</td>
              <td>{u.Email}</td>
              <td>{u.TrangThai}</td>
              <td>{u.RoleID}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(u);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(u.UserID);
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} người dùng</h3>

            <input name="Username" placeholder="Tài khoản" value={form.Username} onChange={handleChange} />
            <input name="PasswordHash" placeholder="Mật khẩu" value={form.PasswordHash} onChange={handleChange} />
            <input name="HoTen" placeholder="Họ tên" value={form.HoTen} onChange={handleChange} />
            <input name="Email" placeholder="Email" value={form.Email} onChange={handleChange} />
            <input name="TrangThai" placeholder="Trạng thái" value={form.TrangThai} onChange={handleChange} />
            <input name="RoleID" placeholder="Vai trò" value={form.RoleID} onChange={handleChange} />

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>
                {isEdit ? "Cập nhật" : "Thêm"}
              </button>

              <button className="btn-cancel" onClick={() => setShowForm(false)}>
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