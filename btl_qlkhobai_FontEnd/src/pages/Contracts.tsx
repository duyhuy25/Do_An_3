import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Contract {
  HopDongID: number;
  KhachHangID: number;
  NgayKy: string;
  NgayHetHan: string | null;
  LoaiDichVu: string;
  GiaTri: number;
  TrangThai: string;

  MaHopDong: string;
  MoTa: string;
  FileHopDong: string;
  DieuKhoan: string;
}

interface KhachHangOption {
  KhachHangID: number;
  TenKH: string;
  SDT: string;
}

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [khachHangs, setKhachHangs] = useState<KhachHangOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Contract | null>(null);

  const [form, setForm] = useState({
    KhachHangID: "",
    NgayKy: "",
    NgayHetHan: "",
    LoaiDichVu: "",
    GiaTri: "",
    TrangThai: "Đang hoạt động",

    MaHopDong: "",
    MoTa: "",
    FileHopDong: "",
    DieuKhoan: ""
  });

  const fetchContracts = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/contract/contract/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/contract/contract";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải hợp đồng");

      const data = await res.json();
      setContracts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchKH = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/customer/customer");
    const data = await res.json();
    setKhachHangs(data);
  }, []);

  useEffect(() => {
    fetchContracts();
    fetchKH();
  }, [fetchContracts, fetchKH]);

  useEffect(() => {
    const t = setTimeout(() => fetchContracts(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchContracts]);

  const formatID = (id: number) => "HD" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      KhachHangID: "",
      NgayKy: "",
      NgayHetHan: "",
      LoaiDichVu: "",
      GiaTri: "",
      TrangThai: "Đang hoạt động",

      MaHopDong: "",
      MoTa: "",
      FileHopDong: "",
      DieuKhoan: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (c: Contract) => {
    setIsEdit(true);
    setSelected(c);

    setForm({
      KhachHangID: c.KhachHangID.toString(),
      NgayKy: c.NgayKy?.slice(0, 10),
      NgayHetHan: c.NgayHetHan?.slice(0, 10) || "",
      LoaiDichVu: c.LoaiDichVu,
      GiaTri: c.GiaTri.toString(),
      TrangThai: c.TrangThai,

      MaHopDong: c.MaHopDong || "",
      MoTa: c.MoTa || "",
      FileHopDong: c.FileHopDong || "",
      DieuKhoan: c.DieuKhoan || ""
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.KhachHangID || !form.NgayKy) {
      alert("Thiếu thông tin bắt buộc");
      return;
    }

    if (form.NgayHetHan && form.NgayHetHan < form.NgayKy) {
      alert("Ngày hết hạn không hợp lệ");
      return;
    }

    const payload = {
      ...form,
      KhachHangID: Number(form.KhachHangID),
      GiaTri: Number(form.GiaTri || 0),
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/contract/contract/${selected.HopDongID}`
        : `http://localhost:5000/api/contract/addcontract`;

      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      fetchContracts(search);
    } catch {
      alert("Lỗi lưu dữ liệu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa hợp đồng?")) return;

    await fetch(`http://localhost:5000/api/contract/contract/${id}`, {
      method: "DELETE"
    });

    fetchContracts(search);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📄 Hợp đồng</h2>

        <div className="toolbar">
          <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleOpenAdd}>+ Thêm</button>
        </div>
      </div>

      <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã HĐ</th>
          <th>Khách hàng</th>
          <th>Ngày ký</th>
          <th>Hết hạn</th>
          <th>Loại DV</th>
          <th>Giá trị</th>
          <th>Trạng thái</th>
          <th>File</th>
          <th>Mô tả</th>
          <th>Tác vụ</th>
        </tr>
      </thead>

      <tbody>
          {contracts.map(c => (
            <tr key={c.HopDongID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.HopDongID)}</td>
              <td>{c.MaHopDong}</td>

              <td>
                {khachHangs.find(k => k.KhachHangID === c.KhachHangID)?.TenKH || c.KhachHangID}
              </td>

              <td>{new Date(c.NgayKy).toLocaleDateString("vi-VN")}</td>

              <td>
                {c.NgayHetHan
                  ? new Date(c.NgayHetHan).toLocaleDateString("vi-VN")
                  : "-"}
              </td>

              <td>{c.LoaiDichVu || "-"}</td>

              <td>{c.GiaTri.toLocaleString("vi-VN")} VND</td>

              <td>{c.TrangThai}</td>

              <td>
                {c.FileHopDong
                  ? <a href={c.FileHopDong} target="_blank">📎</a>
                  : "-"}
              </td>

              <td>{c.MoTa || "-"}</td>

              <td>
                <button onClick={(e)=>{e.stopPropagation();handleOpenEdit(c);}}>Sửa</button>
                <button onClick={(e)=>{e.stopPropagation();handleDelete(c.HopDongID);}}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} hợp đồng</h3>

            <label>Khách hàng *</label>
            <select name="KhachHangID" value={form.KhachHangID} onChange={handleChange}>
              <option value="">-- Chọn khách hàng --</option>
              {khachHangs.map(k => (
                <option key={k.KhachHangID} value={k.KhachHangID}>
                  {k.TenKH} - {k.SDT}
                </option>
              ))}
            </select>

            <label>Mã hợp đồng</label>
            <input name="MaHopDong" value={form.MaHopDong} onChange={handleChange} />

            <label>Ngày ký *</label>
            <input type="date" name="NgayKy" value={form.NgayKy} onChange={handleChange} />

            <label>Ngày hết hạn</label>
            <input type="date" name="NgayHetHan" value={form.NgayHetHan} onChange={handleChange} />

            <label>Loại dịch vụ</label>
            <input name="LoaiDichVu" value={form.LoaiDichVu} onChange={handleChange} />

            <label>Giá trị (VNĐ)</label>
            <input type="number" name="GiaTri" value={form.GiaTri} onChange={handleChange} />

            <label>File hợp đồng (link)</label>
            <input name="FileHopDong" value={form.FileHopDong} onChange={handleChange} />

            <label>Mô tả</label>
            <textarea name="MoTa" value={form.MoTa} onChange={handleChange} />

            <label>Điều khoản</label>
            <textarea name="DieuKhoan" value={form.DieuKhoan} onChange={handleChange} />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option>Đang hoạt động</option>
              <option>Hết hạn</option>
              <option>Chấm dứt</option>
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

export default Contracts;