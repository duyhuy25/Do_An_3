import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Maintenance {
  BaoTriID: number;
  PhuongTienID: number;
  NgayBaoTri: string;
  NoiDung: string;
  ChiPhi: number;
  TrangThai: string;
  NCCID?: number;
}

interface VehicleOption {
  PhuongTienID: number;
  BienSo: string;
  TrangThai: string;
}

interface SupplierOption {
  NCCID: number;
  TenNCC: string;
}

const Maintenance: React.FC = () => {
  const [list, setList] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);

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
    TrangThai: "Chờ bảo trì",
    NCCID: ""
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

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/supplier");
      const data = await res.json();
      setSuppliers(data);
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
    Promise.all([fetchData(), fetchVehicles(), fetchSuppliers()])
      .finally(() => setLoading(false));
  }, [fetchData, fetchVehicles, fetchSuppliers]);

  const formatVehicle = (id: number) =>
    vehicles.find(v => v.PhuongTienID === id)?.BienSo || id;

  const formatSupplier = (id: number) =>
    suppliers.find(s => s.NCCID === id)?.TenNCC || "-";

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
      TrangThai: "Chờ bảo trì",
      NCCID: ""
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Maintenance) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      PhuongTienID: item.PhuongTienID.toString(),
      NgayBaoTri: item.NgayBaoTri ? item.NgayBaoTri.split("T")[0] : "",
      NoiDung: item.NoiDung,
      ChiPhi: item.ChiPhi.toString(),
      TrangThai: item.TrangThai,
      NCCID: item.NCCID ? item.NCCID.toString() : ""
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
      TrangThai: form.TrangThai,
      NCCID: form.NCCID ? Number(form.NCCID) : null
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
        alert("Cập nhật thành công! Trạng thái xe đã được đồng bộ.");
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
            <th>Nhà cung cấp</th>
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
              <td>{formatSupplier(m.NCCID || 0)}</td>
              <td>{new Date(m.NgayBaoTri).toLocaleDateString("vi-VN")}</td>
              <td>{m.NoiDung}</td>
              <td>{m.ChiPhi.toLocaleString("vi-VN")} đ</td>
              <td>{m.TrangThai}</td>
              <td className="actions">
              <div className="td-actions">
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(m);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.BaoTriID);
                  }}
                >
                  Xóa
                </button>
              </div>
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
              <option value="">-- chọn xe --</option>
              {vehicles.map(v => (
                <option key={v.PhuongTienID} value={v.PhuongTienID}>
                  {v.BienSo} ({v.TrangThai})
                </option>
              ))}
            </select>

            <label>Nhà cung cấp thực hiện</label>
            <select name="NCCID" value={form.NCCID} onChange={handleChange}>
              <option value="">-- chọn đối tác --</option>
              {suppliers.map(s => (
                <option key={s.NCCID} value={s.NCCID}>
                  {s.TenNCC}
                </option>
              ))}
            </select>

            <label>Ngày bảo trì *</label>
            <input type="date" name="NgayBaoTri" value={form.NgayBaoTri} onChange={handleChange} />

            <label>Nội dung sửa chữa</label>
            <input name="NoiDung" value={form.NoiDung} onChange={handleChange} placeholder="Ví dụ: Thay dầu, thay lốp..." />

            <label>Chi phí dự kiến/thực tế (đ)</label>
            <input type="number" name="ChiPhi" value={form.ChiPhi} onChange={handleChange} />

            <label>Trạng thái bảo trì</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Chờ bảo trì">Chờ bảo trì</option>
              <option value="Đang bảo trì">Đang bảo trì (Xe sẽ dừng hoạt động)</option>
              <option value="Hoàn thành">Hoàn thành (Xe hoạt động lại & Tạo chi phí)</option>
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

export default Maintenance;