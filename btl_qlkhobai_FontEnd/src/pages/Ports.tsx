import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Port {
  CangID: number;
  TenCang: string;
  MaCang: string;
  ViTri: string;
  QuocGia: string;
  LoaiCang: string;
  TrangThai: string;
}

const Ports: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Port | null>(null);

  const [form, setForm] = useState({
    TenCang: "",
    MaCang: "",
    ViTri: "",
    QuocGia: "",
    LoaiCang: "",
    TrangThai: "Hoạt động"
  });

  const fetchData = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/port/port/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/port/port";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");

      const data = await res.json();
      setPorts(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchData]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const formatID = (id: number) =>
    "CG" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      ViTri: "",
      QuocGia: "",
      LoaiCang: "",
      TrangThai: "Hoạt động"
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Port) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      TenCang: item.TenCang,
      MaCang: item.MaCang,
      ViTri: item.ViTri,
      QuocGia: item.QuocGia || "",
      LoaiCang: item.LoaiCang || "",
      TrangThai: item.TrangThai || "Hoạt động"
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.TenCang) {
      alert("Tên cảng là bắt buộc");
      return;
    }

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/port/port/${selected.CangID}`
        : "http://localhost:5000/api/port/port";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setShowForm(false);
        fetchData(search);
      } else {
        alert("Lỗi server");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/port/port/${id}`, {
        method: "DELETE"
      });

      if (res.ok) fetchData(search);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

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
            <th>Mã</th>
            <th>Địa chỉ</th>
            <th>Quốc gia</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {ports.map((p) => (
            <tr key={p.CangID} onClick={() => handleOpenEdit(p)}>
              <td>{formatID(p.CangID)}</td>
              <td>{p.TenCang}</td>
              <td>{p.MaCang}</td>
              <td>{p.ViTri}</td>
              <td>{p.QuocGia}</td>
              <td>{p.LoaiCang}</td>
              <td>{p.TrangThai}</td>

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

            <label>Tên cảng *</label>
            <input name="TenCang" value={form.TenCang} onChange={handleChange} />

            <label>Mã cảng</label>
            <input name="MaCang" value={form.MaCang} onChange={handleChange} />

            <label>Địa chỉ</label>
            <input name="ViTri" value={form.ViTri} onChange={handleChange} />

            <label>Quốc gia</label>
            <input name="QuocGia" value={form.QuocGia} onChange={handleChange} />

            <label>Loại cảng</label>
            <select name="LoaiCang" value={form.LoaiCang} onChange={handleChange}>
              <option value="">-- Chọn loại cảng --</option>
              <option value="Biển">Biển</option>
              <option value="Sông">Sông</option>
              <option value="Cảng cạn">Cảng cạn</option>
            </select>

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Tạm dừng">Tạm dừng</option>
              <option value="Bảo trì">Bảo trì</option>
            </select>

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