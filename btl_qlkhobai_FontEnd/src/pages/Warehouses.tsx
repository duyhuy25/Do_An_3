import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Warehouse {
  KhoID: number;
  TenKho: string;
  SucChua: number;
  SoLuongContainer: number;
  DiaChi: string;
  NhanVienQuanLy: string;
}

const Warehouses: React.FC = () => {

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Warehouse | null>(null);

  const [form, setForm] = useState({
    TenKho: "",
    SucChua: "",
    SoLuongContainer: "",
    DiaChi: "",
    NhanVienQuanLy: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/warehouse/warehouse");
    const data = await res.json();
    setWarehouses(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "WH" + id.toString().padStart(3, "0");

  const filtered = warehouses.filter((w) =>
    w.TenKho.toLowerCase().includes(search.toLowerCase())
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
      TenKho: "",
      SucChua: "",
      SoLuongContainer: "",
      DiaChi: "",
      NhanVienQuanLy: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Warehouse) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      TenKho: item.TenKho,
      SucChua: item.SucChua.toString(),
      SoLuongContainer: item.SoLuongContainer.toString(),
      DiaChi: item.DiaChi,
      NhanVienQuanLy: item.NhanVienQuanLy
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      SucChua: Number(form.SucChua),
      SoLuongContainer: Number(form.SoLuongContainer)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/warehouse/warehouse/${selected.KhoID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/warehouse/warehouse", {
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

    await fetch(`http://localhost:5000/api/warehouse/warehouse/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>🏭 Danh sách kho</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm kho..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm kho
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên kho</th>
            <th>Sức chứa</th>
            <th>Số lượng container</th>
            <th>Địa chỉ</th>
            <th>Quản lý</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((w) => (
            <tr key={w.KhoID} onClick={() => handleOpenEdit(w)}>
              <td>{formatID(w.KhoID)}</td>
              <td>{w.TenKho}</td>
              <td>{w.SucChua}</td>
              <td>{w.SoLuongContainer}</td>
              <td>{w.DiaChi}</td>
              <td>{w.NhanVienQuanLy}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(w);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(w.KhoID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} kho</h3>

            <input name="TenKho" placeholder="Tên kho" value={form.TenKho} onChange={handleChange} />
            <input name="SucChua" placeholder="Sức chứa" value={form.SucChua} onChange={handleChange} />
            <input name="SoLuongContainer" placeholder="Số lượng container" value={form.SoLuongContainer} onChange={handleChange} />
            <input name="DiaChi" placeholder="Địa chỉ" value={form.DiaChi} onChange={handleChange} />
            <input name="NhanVienQuanLy" placeholder="Quản lý" value={form.NhanVienQuanLy} onChange={handleChange} />

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

export default Warehouses;