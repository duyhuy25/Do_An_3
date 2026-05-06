import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Trip {
  ChuyenDiID: number;
  MaChuyen: string;
  CangDiID: number;
  CangDenID: number;
  NgayKhoiHanh: string;
  NgayDuKienDen: string;
  PhuongTienID: number;
  TrangThai: string;

  TaiXe: string;
  SDTTaiXe: string;
  NhienLieuTieuThu: number;
  QuangDuong: number;
  GhiChu: string;
}

interface Cang {
  CangID: number;
  TenCang: string;
}

interface Vehicle {
  PhuongTienID: number;
  BienSo: string;
}

const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [cangs, setCangs] = useState<Cang[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Trip | null>(null);

  const [form, setForm] = useState({
    MaChuyen: "",
    CangDiID: "",
    CangDenID: "",
    NgayKhoiHanh: "",
    NgayDuKienDen: "",
    PhuongTienID: "",
    TrangThai: "Chuẩn bị",

    TaiXe: "",
    SDTTaiXe: "",
    NhienLieuTieuThu: "",
    QuangDuong: "",
    GhiChu: ""
  });

  const fetchTrips = useCallback(async (searchTerm = "") => {
    try {

      const url = searchTerm
        ? `http://localhost:5000/api/trip/trip/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/trip/trip`;

      const res = await fetch(url);
      const data = await res.json();
      setTrips(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    const [c, v] = await Promise.all([
      fetch("http://localhost:5000/api/port/port").then(r => r.json()),
      fetch("http://localhost:5000/api/vehicle/vehicle").then(r => r.json())
    ]);

    setCangs(c);
    setVehicles(v);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTrips(), fetchOptions()]).finally(() => setLoading(false));
  }, [fetchTrips, fetchOptions]);

  useEffect(() => {
    const t = setTimeout(() => fetchTrips(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchTrips]);

  const formatID = (id: number) => "CD" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      MaChuyen: "",
      CangDiID: "",
      CangDenID: "",
      NgayKhoiHanh: "",
      NgayDuKienDen: "",
      PhuongTienID: "",
      TrangThai: "Chuẩn bị",

      TaiXe: "",
      SDTTaiXe: "",
      NhienLieuTieuThu: "",
      QuangDuong: "",
      GhiChu: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (t: Trip) => {
    setIsEdit(true);
    setSelected(t);

    setForm({
      MaChuyen: t.MaChuyen,
      CangDiID: t.CangDiID.toString(),
      CangDenID: t.CangDenID.toString(),
      NgayKhoiHanh: t.NgayKhoiHanh?.slice(0, 10),
      NgayDuKienDen: t.NgayDuKienDen?.slice(0, 10),
      PhuongTienID: t.PhuongTienID.toString(),
      TrangThai: t.TrangThai,

      TaiXe: t.TaiXe || "",
      SDTTaiXe: t.SDTTaiXe || "",
      NhienLieuTieuThu: t.NhienLieuTieuThu?.toString() || "",
      QuangDuong: t.QuangDuong?.toString() || "",
      GhiChu: t.GhiChu || ""
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.MaChuyen || !form.CangDiID || !form.CangDenID) {
      alert("Thiếu thông tin bắt buộc (Mã chuyến, Cảng đi, Cảng đến)!");
      return;
    }

    if (form.CangDiID === form.CangDenID) {
      alert("Cảng đi và cảng đến không được trùng nhau!");
      return;
    }

    if (form.NgayKhoiHanh && form.NgayDuKienDen) {
      if (new Date(form.NgayDuKienDen) < new Date(form.NgayKhoiHanh)) {
        alert("Ngày dự kiến đến không thể trước ngày khởi hành!");
        return;
      }
    }

    if (form.NhienLieuTieuThu && Number(form.NhienLieuTieuThu) < 0) {
      alert("Nhiên liệu tiêu thụ không thể âm!");
      return;
    }

    const payload = {
      ...form,
      CangDiID: Number(form.CangDiID),
      CangDenID: Number(form.CangDenID),
      PhuongTienID: Number(form.PhuongTienID),
      NhienLieuTieuThu: Number(form.NhienLieuTieuThu || 0),
      QuangDuong: Number(form.QuangDuong || 0),
      UserID: currentUser.UserID
    };

    const url = isEdit && selected
      ? `http://localhost:5000/api/trip/trip/${selected.ChuyenDiID}`
      : `http://localhost:5000/api/trip/addtrip`;

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setShowForm(false);
    fetchTrips(search);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa?")) return;

    await fetch(`http://localhost:5000/api/trip/trip/${id}?userId=${currentUser.UserID}`, {
      method: "DELETE"
    });

    fetchTrips(search);
  };

  if (error) return <div className="error">{error}</div>;

  // ================= UI =================
  return (
    <div>
      {loading && <div className="loading">Đang tải...</div>}
      <div className="header">
        <h2>🚢 Chuyến đi</h2>

        <div className="toolbar">
          <input className="search" placeholder="Tìm kiếm" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm
          </button>
        </div>
      </div>

      <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã</th>
          <th>Cảng đi</th>
          <th>Cảng đến</th>
          <th>ETD</th>
          <th>ETA</th>
          <th>Xe</th>
          <th>Tài xế</th>
          <th>SĐT</th>
          <th>Quãng đường</th>
          <th>Nhiên liệu</th>
          <th>Trạng thái</th>
          <th>Ghi chú</th>
          <th>Tác vụ</th>
        </tr>
      </thead>

      <tbody>
        {trips.map(t => (
          <tr key={t.ChuyenDiID} onClick={() => handleOpenEdit(t)}>
            <td>{formatID(t.ChuyenDiID)}</td>
            <td>{t.MaChuyen}</td>

            <td>{cangs.find(c => c.CangID === t.CangDiID)?.TenCang}</td>
            <td>{cangs.find(c => c.CangID === t.CangDenID)?.TenCang}</td>

            <td>{t.NgayKhoiHanh && new Date(t.NgayKhoiHanh).toLocaleDateString()}</td>
            <td>{t.NgayDuKienDen && new Date(t.NgayDuKienDen).toLocaleDateString()}</td>

            <td>{vehicles.find(v => v.PhuongTienID === t.PhuongTienID)?.BienSo}</td>

            <td>{t.TaiXe || "-"}</td>
            <td>{t.SDTTaiXe || "-"}</td>

            <td>{t.QuangDuong ? `${t.QuangDuong} km` : "-"}</td>
            <td>{t.NhienLieuTieuThu ? `${t.NhienLieuTieuThu} L` : "-"}</td>

            <td>{t.TrangThai}</td>
            <td>{t.GhiChu || "-"}</td>

            <td className="actions">
              <div className="td-actions">
                <button className="btn-edit" onClick={(e)=>{e.stopPropagation();handleOpenEdit(t);}}>Sửa</button>
                <button className="btn-delete" onClick={(e)=>{e.stopPropagation();handleDelete(t.ChuyenDiID);}}>Xóa</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} chuyến</h3>

            <label>Mã chuyến *</label>
            <input name="MaChuyen" value={form.MaChuyen} onChange={handleChange} />

            <label>Cảng đi *</label>
            <select name="CangDiID" value={form.CangDiID} onChange={handleChange}>
              <option value="">-- Chọn cảng đi --</option>
              {cangs.map(c => <option key={c.CangID} value={c.CangID}>{c.TenCang}</option>)}
            </select>

            <label>Cảng đến *</label>
            <select name="CangDenID" value={form.CangDenID} onChange={handleChange}>
              <option value="">-- Chọn cảng đến --</option>
              {cangs.map(c => <option key={c.CangID} value={c.CangID}>{c.TenCang}</option>)}
            </select>

            <label>Ngày khởi hành (ETD)</label>
            <input type="date" name="NgayKhoiHanh" value={form.NgayKhoiHanh} onChange={handleChange} />

            <label>Ngày dự kiến đến (ETA)</label>
            <input type="date" name="NgayDuKienDen" value={form.NgayDuKienDen} onChange={handleChange} />

            <label>Phương tiện</label>
            <select name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange}>
              <option value="">-- Chọn xe --</option>
              {vehicles.map(v => <option key={v.PhuongTienID} value={v.PhuongTienID}>{v.BienSo}</option>)}
            </select>

            <label>Tài xế</label>
            <input name="TaiXe" value={form.TaiXe} onChange={handleChange} />

            <label>SĐT tài xế</label>
            <input name="SDTTaiXe" value={form.SDTTaiXe} onChange={handleChange} />

            <label>Quãng đường (km)</label>
            <input name="QuangDuong" value={form.QuangDuong} onChange={handleChange} />

            <label>Nhiên liệu tiêu thụ (L)</label>
            <input name="NhienLieuTieuThu" value={form.NhienLieuTieuThu} onChange={handleChange} />

            <label>Ghi chú</label>
            <textarea name="GhiChu" value={form.GhiChu} onChange={handleChange} />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option>Chuẩn bị</option>
              <option>Đã phân công</option>
              <option>Đang chạy</option>
              <option>Hoàn thành</option>
              <option>Hủy</option>
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

export default Trips;