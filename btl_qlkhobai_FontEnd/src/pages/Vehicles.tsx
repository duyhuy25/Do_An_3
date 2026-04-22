import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Vehicle {
  PhuongTienID: number;
  LoaiPhuongTien: string;
  BienSo: string;
  HinhAnh: string;
  TaiTrong: number;
  TrangThai: string;
  MoTa: string;

  NamSanXuat: number;
  ChuSoHuu: string;
  HanDangKiem: string;
  GPS: string;
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const [form, setForm] = useState({
    LoaiPhuongTien: "",
    BienSo: "",
    HinhAnh: "",
    TaiTrong: "",
    TrangThai: "Sẵn sàng",
    MoTa: "",

    NamSanXuat: "",
    ChuSoHuu: "",
    HanDangKiem: "",
    GPS: ""
  });

  // FETCH
  const fetchVehicles = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/vehicle/vehicle/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/vehicle/vehicle`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách");

      const data = await res.json();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  useEffect(() => {
    const t = setTimeout(() => fetchVehicles(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchVehicles]);

  const formatID = (id: number) => "VH" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      LoaiPhuongTien: "",
      BienSo: "",
      HinhAnh: "",
      TaiTrong: "",
      TrangThai: "Sẵn sàng",
      MoTa: "",

      NamSanXuat: "",
      ChuSoHuu: "",
      HanDangKiem: "",
      GPS: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setIsEdit(true);
    setSelected(v);

    setForm({
      LoaiPhuongTien: v.LoaiPhuongTien || "",
      BienSo: v.BienSo || "",
      HinhAnh: v.HinhAnh || "",
      TaiTrong: v.TaiTrong?.toString() || "",
      TrangThai: v.TrangThai || "Sẵn sàng",
      MoTa: v.MoTa || "",

      NamSanXuat: v.NamSanXuat?.toString() || "",
      ChuSoHuu: v.ChuSoHuu || "",
      HanDangKiem: v.HanDangKiem ? v.HanDangKiem.split("T")[0] : "",
      GPS: v.GPS || ""
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.LoaiPhuongTien || !form.BienSo) {
      alert("Thiếu loại xe hoặc biển số!");
      return;
    }

    const payload = {
      ...form,
      TaiTrong: Number(form.TaiTrong || 0),
      NamSanXuat: Number(form.NamSanXuat || 0)
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/vehicle/vehicle/${selected.PhuongTienID}`
        : `http://localhost:5000/api/vehicle/vehicle`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Thành công!");
      setShowForm(false);
      fetchVehicles(search);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa?")) return;

    await fetch(`http://localhost:5000/api/vehicle/vehicle/${id}`, {
      method: "DELETE"
    });

    fetchVehicles(search);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🚚 Phương tiện</h2>

        <div className="toolbar">
          <input className="search" value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={handleOpenAdd}>+ Thêm</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Loại</th>
            <th>Biển số</th>
            <th>Tải trọng</th>
            <th>Năm SX</th>
            <th>Trạng thái</th>
            <th>GPS</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map(v => (
            <tr key={v.PhuongTienID} onClick={() => handleOpenEdit(v)}>
              <td>{formatID(v.PhuongTienID)}</td>

              <td>
                {v.HinhAnh ? (
                  <img src={v.HinhAnh} width="60" />
                ) : "🚗"}
              </td>

              <td>{v.LoaiPhuongTien}</td>
              <td>{v.BienSo}</td>
              <td>{v.TaiTrong}</td>
              <td>{v.NamSanXuat}</td>
              <td>{v.TrangThai}</td>
              <td>{v.GPS || "-"}</td>

              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(v); }}>Sửa</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(v.PhuongTienID); }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} phương tiện</h3>

            <input name="LoaiPhuongTien" value={form.LoaiPhuongTien} onChange={handleChange} placeholder="Loại xe" />
            <input name="BienSo" value={form.BienSo} onChange={handleChange} placeholder="Biển số" />

            <input name="HinhAnh" value={form.HinhAnh} onChange={handleChange} placeholder="Link ảnh" />
            {form.HinhAnh && <img src={form.HinhAnh} width="80" />}

            <input name="TaiTrong" value={form.TaiTrong} onChange={handleChange} placeholder="Tải trọng" />
            <input name="NamSanXuat" value={form.NamSanXuat} onChange={handleChange} placeholder="Năm SX" />

            <input name="ChuSoHuu" value={form.ChuSoHuu} onChange={handleChange} placeholder="Chủ sở hữu" />

            <input type="date" name="HanDangKiem" value={form.HanDangKiem} onChange={handleChange} />

            <input name="GPS" value={form.GPS} onChange={handleChange} placeholder="GPS (lat,lng)" />

            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option>Sẵn sàng</option>
              <option>Đang chạy</option>
              <option>Bảo trì</option>
            </select>

            <input name="MoTa" value={form.MoTa} onChange={handleChange} placeholder="Mô tả" />

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

export default Vehicles;