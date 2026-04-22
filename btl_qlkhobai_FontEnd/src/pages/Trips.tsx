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
      setLoading(true);

      const url = searchTerm
        ? `http://localhost:5000/api/trip/trip/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/trip/trip`;

      const res = await fetch(url);
      const data = await res.json();
      setTrips(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    fetchTrips();
    fetchOptions();
  }, [fetchTrips, fetchOptions]);

  useEffect(() => {
    const t = setTimeout(() => fetchTrips(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchTrips]);

  const formatID = (id: number) => "TRP" + id.toString().padStart(3, "0");

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
      alert("Thiếu thông tin bắt buộc");
      return;
    }

    const payload = {
      ...form,
      CangDiID: Number(form.CangDiID),
      CangDenID: Number(form.CangDenID),
      PhuongTienID: Number(form.PhuongTienID),
      NhienLieuTieuThu: Number(form.NhienLieuTieuThu || 0),
      QuangDuong: Number(form.QuangDuong || 0)
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

    await fetch(`http://localhost:5000/api/trip/trip/${id}`, {
      method: "DELETE"
    });

    fetchTrips(search);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  // ================= UI =================
  return (
    <div>
      <div className="header">
        <h2>🚢 Chuyến đi</h2>

        <div className="toolbar">
          <input className="search" value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={handleOpenAdd}>+ Thêm</button>
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
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {trips.map(t => (
            <tr key={t.ChuyenDiID} onClick={() => handleOpenEdit(t)}>
              <td>{formatID(t.ChuyenDiID)}</td>
              <td>{t.MaChuyen}</td>
              <td>{cangs.find(c => c.CangID === t.CangDiID)?.TenCang || t.CangDiID}</td>
              <td>{cangs.find(c => c.CangID === t.CangDenID)?.TenCang || t.CangDenID}</td>
              <td>{t.NgayKhoiHanh && new Date(t.NgayKhoiHanh).toLocaleDateString()}</td>
              <td>{t.NgayDuKienDen && new Date(t.NgayDuKienDen).toLocaleDateString()}</td>
              <td>{vehicles.find(v => v.PhuongTienID === t.PhuongTienID)?.BienSo || t.PhuongTienID}</td>
              <td>{t.TaiXe}</td>
              <td>{t.TrangThai}</td>

              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(t); }}>Sửa</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(t.ChuyenDiID); }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} chuyến</h3>

            <input name="MaChuyen" value={form.MaChuyen} onChange={handleChange} placeholder="Mã chuyến" />

            <select name="CangDiID" value={form.CangDiID} onChange={handleChange}>
              <option value="">-- Cảng đi --</option>
              {cangs.map(c => <option key={c.CangID} value={c.CangID}>{c.TenCang}</option>)}
            </select>

            <select name="CangDenID" value={form.CangDenID} onChange={handleChange}>
              <option value="">-- Cảng đến --</option>
              {cangs.map(c => <option key={c.CangID} value={c.CangID}>{c.TenCang}</option>)}
            </select>

            <input type="date" name="NgayKhoiHanh" value={form.NgayKhoiHanh} onChange={handleChange} />
            <input type="date" name="NgayDuKienDen" value={form.NgayDuKienDen} onChange={handleChange} />

            <select name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange}>
              <option value="">-- Chọn xe --</option>
              {vehicles.map(v => <option key={v.PhuongTienID} value={v.PhuongTienID}>{v.BienSo}</option>)}
            </select>

            <input name="TaiXe" value={form.TaiXe} onChange={handleChange} placeholder="Tài xế" />
            <input name="SDTTaiXe" value={form.SDTTaiXe} onChange={handleChange} placeholder="SĐT tài xế" />

            <input name="QuangDuong" value={form.QuangDuong} onChange={handleChange} placeholder="Quãng đường (km)" />
            <input name="NhienLieuTieuThu" value={form.NhienLieuTieuThu} onChange={handleChange} placeholder="Nhiên liệu (L)" />

            <textarea name="GhiChu" value={form.GhiChu} onChange={handleChange} placeholder="Ghi chú" />

            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option>Chuẩn bị</option>
              <option>Đang chạy</option>
              <option>Hoàn thành</option>
              <option>Hủy</option>
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

export default Trips;