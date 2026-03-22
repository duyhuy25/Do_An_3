import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Port {
  CangID: number;
  TenCang: string;
  MaCang: string;
  ViTri: string;
}

const Ports: React.FC = () => {

  const [ports, setPorts] = useState<Port[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Port | null>(null);

  const [form, setForm] = useState({
    TenCang: "",
    MaCang: "",
    ViTri: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/port/port");
    const data = await res.json();
    setPorts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "CG" + id.toString().padStart(3, "0");

  const filtered = ports.filter((p) =>
    p.TenCang.toLowerCase().includes(search.toLowerCase())
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
      TenCang: "",
      MaCang: "",
      ViTri: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Port) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      TenCang: item.TenCang,
      MaCang: item.MaCang,
      ViTri: item.ViTri
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = { ...form };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/port/port/${selected.CangID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/port/port", {
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

    await fetch(`http://localhost:5000/api/port/port/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>⚓ Danh sách cảng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm cảng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm cảng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên cảng</th>
            <th>Mã cảng</th>
            <th>Địa chỉ</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p) => (
            <tr key={p.CangID} onClick={() => handleOpenEdit(p)}>
              <td>{formatID(p.CangID)}</td>
              <td>{p.TenCang}</td>
              <td>{p.MaCang}</td>
              <td>{p.ViTri}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(p);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.CangID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} cảng</h3>

            <input name="TenCang" placeholder="Tên cảng" value={form.TenCang} onChange={handleChange} />
            <input name="MaCang" placeholder="Mã cảng" value={form.MaCang} onChange={handleChange} />
            <input name="ViTri" placeholder="Địa chỉ" value={form.ViTri} onChange={handleChange} />

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

export default Ports;