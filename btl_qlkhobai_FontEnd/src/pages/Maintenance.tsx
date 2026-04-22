import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Maintenance {
  BaoTriID: number;
  PhuongTienID: number;
  NgayBaoTri: string;
  NoiDung: string;
  ChiPhi: number;
  TrangThai: string;
}

interface VehicleOption {
  PhuongTienID: number;
  BienSo: string;
}

const Maintenance: React.FC = () => {
  const [list, setList] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Maintenance | null>(null);

  const [form, setForm] = useState({
    PhuongTienID: "",
    NgayBaoTri: "",
    NoiDung: "",
    ChiPhi: "",
    TrangThai: "Chờ bảo trì"
  });

  const fetchData = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/maintenance/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/maintenance";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");

      const data = await res.json();
      setList(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vehicle/vehicle");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
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
    Promise.all([fetchData(), fetchVehicles()])
      .finally(() => setLoading(false));
  }, [fetchData, fetchVehicles]);

  const formatVehicle = (id: number) =>
    vehicles.find(v => v.PhuongTienID === id)?.BienSo || id;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      PhuongTienID: "",
      NgayBaoTri: "",
      NoiDung: "",
      ChiPhi: "",
      TrangThai: "Chờ bảo trì"
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Maintenance) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      PhuongTienID: item.PhuongTienID.toString(),
      NgayBaoTri: item.NgayBaoTri,
      NoiDung: item.NoiDung,
      ChiPhi: item.ChiPhi.toString(),
      TrangThai: item.TrangThai
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.PhuongTienID || !form.NgayBaoTri) {
      alert("Thiếu thông tin bắt buộc");
      return;
    }

    const body = {
      PhuongTienID: Number(form.PhuongTienID),
      NgayBaoTri: form.NgayBaoTri,
      NoiDung: form.NoiDung,
      ChiPhi: Number(form.ChiPhi || 0),
      TrangThai: form.TrangThai
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/maintenance/${selected.BaoTriID}`
        : "http://localhost:5000/api/maintenance";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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
    if (!window.confirm("Xóa bản ghi này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}`, {
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
        <h2>🛠️ Bảo trì phương tiện</h2>
        <div className="toolbar">
          <input
            className="search"
            placeholder="🔍 Tìm kiếm..."
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
            <th>Phương tiện</th>
            <th>Ngày</th>
            <th>Nội dung</th>
            <th>Chi phí</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {list.map(m => (
            <tr key={m.BaoTriID} onClick={() => handleOpenEdit(m)}>
              <td>{m.BaoTriID}</td>
              <td>{formatVehicle(m.PhuongTienID)}</td>
              <td>{new Date(m.NgayBaoTri).toLocaleDateString("vi-VN")}</td>
              <td>{m.NoiDung}</td>
              <td>{m.ChiPhi.toLocaleString("vi-VN")} đ</td>
              <td>{m.TrangThai}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(m); }}>
                  Sửa
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(m.BaoTriID); }}>
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
            <h3>{isEdit ? "Sửa bảo trì" : "Thêm bảo trì"}</h3>

            <label>Phương tiện *</label>
            <select name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange}>
              <option value="">-- chọn --</option>
              {vehicles.map(v => (
                <option key={v.PhuongTienID} value={v.PhuongTienID}>
                  {v.BienSo}
                </option>
              ))}
            </select>

            <label>Ngày bảo trì *</label>
            <input type="date" name="NgayBaoTri" value={form.NgayBaoTri} onChange={handleChange} />

            <label>Nội dung</label>
            <input name="NoiDung" value={form.NoiDung} onChange={handleChange} />

            <label>Chi phí</label>
            <input type="number" name="ChiPhi" value={form.ChiPhi} onChange={handleChange} />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Chờ bảo trì">Chờ bảo trì</option>
              <option value="Đang bảo trì">Đang bảo trì</option>
              <option value="Hoàn thành">Hoàn thành</option>
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

export default Maintenance;