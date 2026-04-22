import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Container {
  ContainerID: number;
  HopDongID: number;
  LoaiHangID: number;
  TrongLuong: number;
  TrangThai: string;
  KhoID: number | null;
  PhuongTienID: number | null;

  MaContainer: string;
  KichThuoc: string;
  LoaiContainer: string;
  NgayDongHang: string | null;
  NgayMoHang: string | null;
  TinhTrangVo: string;
  NhietDoBaoQuan: number | null;
  DoAm: number | null;
}

interface LoaiHangOption { LoaiHangID: number; TenLoai: string; }
interface KhoOption { KhoID: number; TenKho: string; }
interface PhuongTienOption { PhuongTienID: number; BienSo: string; }
interface HopDongOption { HopDongID: number; MaHopDong?: string; }

const Containers: React.FC = () => {

  const [containers, setContainers] = useState<Container[]>([]);
  const [loaiHangs, setLoaiHangs] = useState<LoaiHangOption[]>([]);
  const [khos, setKhos] = useState<KhoOption[]>([]);
  const [phuongTiens, setPhuongTiens] = useState<PhuongTienOption[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);

  const [form, setForm] = useState({
    LoaiHangID: "",
    TrongLuong: "",
    TrangThai: "Rỗng",
    KhoID: "",
    PhuongTienID: "",
    HopDongID: "",

    MaContainer: "",
    KichThuoc: "",
    LoaiContainer: "",
    NgayDongHang: "",
    NgayMoHang: "",
    TinhTrangVo: "",
    NhietDoBaoQuan: "",
    DoAm: "",
  });

  const fetchContainers = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/container/container/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/container/container";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải container");
      const data = await res.json();
      setContainers(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const [lh, k, pt, hd] = await Promise.all([
        fetch("http://localhost:5000/api/itemtype/itemtype").then(res => res.json()),
        fetch("http://localhost:5000/api/warehouse/warehouse").then(res => res.json()),
        fetch("http://localhost:5000/api/vehicle/vehicle").then(res => res.json()),
        fetch("http://localhost:5000/api/contract/contract").then(res => res.json())
      ]);

      setLoaiHangs(lh);
      setKhos(k);
      setPhuongTiens(pt);
      setHopDongs(hd);

    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchContainers(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchContainers]);

  useEffect(() => {
    setLoading(true);
    fetchOptions().finally(() => setLoading(false));
  }, [fetchOptions]);

  const formatID = (id: number) => "CTN" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      LoaiHangID: "",
      TrongLuong: "",
      TrangThai: "Rỗng",
      KhoID: "",
      PhuongTienID: "",
      HopDongID: "",

      MaContainer: "",
      KichThuoc: "",
      LoaiContainer: "",
      NgayDongHang: "",
      NgayMoHang: "",
      TinhTrangVo: "",
      NhietDoBaoQuan: "",
      DoAm: "",
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Container) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      LoaiHangID: item.LoaiHangID.toString(),
      TrongLuong: item.TrongLuong.toString(),
      TrangThai: item.TrangThai,
      KhoID: item.KhoID?.toString() || "",
      PhuongTienID: item.PhuongTienID?.toString() || "",
      HopDongID: item.HopDongID.toString(),

      MaContainer: item.MaContainer || "",
      KichThuoc: item.KichThuoc || "",
      LoaiContainer: item.LoaiContainer || "",
      NgayDongHang: item.NgayDongHang?.slice(0, 10) || "",
      NgayMoHang: item.NgayMoHang?.slice(0, 10) || "",
      TinhTrangVo: item.TinhTrangVo || "",
      NhietDoBaoQuan: item.NhietDoBaoQuan?.toString() || "",
      DoAm: item.DoAm?.toString() || "",
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.LoaiHangID || !form.HopDongID || !form.TrongLuong) {
      alert("Thiếu dữ liệu bắt buộc!");
      return;
    }

    const body = {
      LoaiHangID: Number(form.LoaiHangID),
      TrongLuong: Number(form.TrongLuong),
      TrangThai: form.TrangThai,
      HopDongID: Number(form.HopDongID),
      KhoID: form.KhoID ? Number(form.KhoID) : null,
      PhuongTienID: form.PhuongTienID ? Number(form.PhuongTienID) : null,

      MaContainer: form.MaContainer || null,
      KichThuoc: form.KichThuoc || null,
      LoaiContainer: form.LoaiContainer || null,
      NgayDongHang: form.NgayDongHang || null,
      NgayMoHang: form.NgayMoHang || null,
      TinhTrangVo: form.TinhTrangVo || null,
      NhietDoBaoQuan: form.NhietDoBaoQuan ? Number(form.NhietDoBaoQuan) : null,
      DoAm: form.DoAm ? Number(form.DoAm) : null,
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/container/container/${selected.ContainerID}`
        : "http://localhost:5000/api/container/addcontainer";

      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      setShowForm(false);
      fetchContainers(search);

    } catch (err) {
      alert("Lỗi lưu dữ liệu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa container này?")) return;

    await fetch(`http://localhost:5000/api/container/container/${id}`, {
      method: "DELETE"
    });

    fetchContainers(search);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📦 Container</h2>

        <div className="toolbar">
          <input
            className="search"
            placeholder="Tìm..."
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
            <th>Mã</th>
            <th>Loại</th>
            <th>Kg</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>PT</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {containers.map(c => (
            <tr key={c.ContainerID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.ContainerID)}</td>
              <td>{c.MaContainer || "-"}</td>
              <td>{c.LoaiContainer || "-"}</td>
              <td>{c.TrongLuong}</td>
              <td>{c.TrangThai}</td>
              <td>{khos.find(k => k.KhoID === c.KhoID)?.TenKho || "-"}</td>
              <td>{phuongTiens.find(p => p.PhuongTienID === c.PhuongTienID)?.BienSo || "-"}</td>

              <td>
                <button onClick={(e)=>{e.stopPropagation();handleOpenEdit(c)}}>Sửa</button>
                <button onClick={(e)=>{e.stopPropagation();handleDelete(c.ContainerID)}}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">

            <h3>{isEdit ? "Sửa" : "Thêm"} Container</h3>

            <input name="MaContainer" value={form.MaContainer} onChange={handleChange} placeholder="Mã container" />
            <input name="LoaiContainer" value={form.LoaiContainer} onChange={handleChange} placeholder="Loại container" />
            <input name="KichThuoc" value={form.KichThuoc} onChange={handleChange} placeholder="Kích thước" />

            <input type="number" name="TrongLuong" value={form.TrongLuong} onChange={handleChange} placeholder="Trọng lượng" />

            <input type="date" name="NgayDongHang" value={form.NgayDongHang} onChange={handleChange} />
            <input type="date" name="NgayMoHang" value={form.NgayMoHang} onChange={handleChange} />

            <input name="TinhTrangVo" value={form.TinhTrangVo} onChange={handleChange} placeholder="Tình trạng vỏ" />
            <input type="number" name="NhietDoBaoQuan" value={form.NhietDoBaoQuan} onChange={handleChange} placeholder="Nhiệt độ" />
            <input type="number" name="DoAm" value={form.DoAm} onChange={handleChange} placeholder="Độ ẩm" />

            <div className="modal-actions">
              <button onClick={handleSubmit}>Lưu</button>
              <button onClick={()=>setShowForm(false)}>Hủy</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Containers;