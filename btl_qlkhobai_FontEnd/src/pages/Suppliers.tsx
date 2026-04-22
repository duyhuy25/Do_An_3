import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Supplier {
  NCCID: number;
  TenNCC: string;
  DichVu: string;
  SDT: string;
  Email: string;
  DiaChi: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);

  const [form, setForm] = useState({
    TenNCC: "",
    DichVu: "",
    SDT: "",
    Email: "",
    DiaChi: ""
  });

  const fetchSuppliers = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/supplier/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/supplier";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải nhà cung cấp");

      const data = await res.json();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuppliers(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchSuppliers]);

  useEffect(() => {
    setLoading(true);
    fetchSuppliers().finally(() => setLoading(false));
  }, [fetchSuppliers]);

  const formatID = (id: number) =>
    "NCC" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      TenNCC: "",
      DichVu: "",
      SDT: "",
      Email: "",
      DiaChi: ""
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Supplier) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      TenNCC: item.TenNCC,
      DichVu: item.DichVu,
      SDT: item.SDT,
      Email: item.Email,
      DiaChi: item.DiaChi
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.TenNCC) {
      alert("Tên nhà cung cấp là bắt buộc");
      return;
    }

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/supplier/${selected.NCCID}`
        : "http://localhost:5000/api/supplier";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setShowForm(false);
        fetchSuppliers(search);
      } else {
        alert("Lỗi server");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa nhà cung cấp này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/supplier/${id}`, {
        method: "DELETE"
      });

      if (res.ok) fetchSuppliers(search);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🏢 Quản lý Nhà cung cấp</h2>
        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm NCC
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Dịch vụ</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.NCCID} onClick={() => handleOpenEdit(s)}>
              <td>{formatID(s.NCCID)}</td>
              <td>{s.TenNCC}</td>
              <td>{s.DichVu}</td>
              <td>{s.SDT}</td>
              <td>{s.Email}</td>
              <td>{s.DiaChi}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }}>
                  Sửa
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(s.NCCID); }}>
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
            <h3>{isEdit ? "Sửa NCC" : "Thêm NCC"}</h3>

            <label>Tên NCC *</label>
            <input name="TenNCC" value={form.TenNCC} onChange={handleChange} />

            <label>Dịch vụ</label>
            <input name="DichVu" value={form.DichVu} onChange={handleChange} />

            <label>SĐT</label>
            <input name="SDT" value={form.SDT} onChange={handleChange} />

            <label>Email</label>
            <input name="Email" value={form.Email} onChange={handleChange} />

            <label>Địa chỉ</label>
            <input name="DiaChi" value={form.DiaChi} onChange={handleChange} />

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

export default Suppliers;