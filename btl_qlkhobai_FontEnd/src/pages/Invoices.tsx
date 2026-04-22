import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Invoice {
  HoaDonID: number;
  HopDongID: number;
  SoTien: number;
  NgayLap: string;
  PhanTramDaThanhToan: number;
  TrangThai: string;
  HanThanhToan: string;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const [form, setForm] = useState({
    HopDongID: "",
    SoTien: "",
    NgayLap: "",
    PhanTramDaThanhToan: "0",
    TrangThai: "Chưa thanh toán",
    HanThanhToan: ""
  });

  const fetchInvoices = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/invoice/invoice/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/invoice/invoice";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách hóa đơn");

      const data = await res.json();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHopDongs = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/contract/contract");
    const data = await res.json();
    setHopDongs(data);
  }, []);

  useEffect(() => {
    fetchInvoices();
    fetchHopDongs();
  }, [fetchInvoices, fetchHopDongs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchInvoices(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchInvoices]);

  const formatID = (id: number) => "HDN" + id.toString().padStart(3, "0");

  const hopDongMap = Object.fromEntries(
    hopDongs.map((h) => [h.HopDongID, h])
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      HopDongID: "",
      SoTien: "",
      NgayLap: "",
      PhanTramDaThanhToan: "0",
      TrangThai: "Chưa thanh toán",
      HanThanhToan: ""
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Invoice) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      HopDongID: item.HopDongID.toString(),
      SoTien: item.SoTien.toString(),
      NgayLap: item.NgayLap?.slice(0, 10) || "",
      PhanTramDaThanhToan: item.PhanTramDaThanhToan.toString(),
      TrangThai: item.TrangThai || "",
      HanThanhToan: item.HanThanhToan?.slice(0, 10) || ""
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.HopDongID) return alert("Chọn hợp đồng");
    if (!form.SoTien || Number(form.SoTien) <= 0) return alert("Số tiền sai");

    const percent = Number(form.PhanTramDaThanhToan);

    // 🔥 auto status
    let status = "Chưa thanh toán";
    if (percent === 100) status = "Đã thanh toán";
    else if (percent > 0) status = "Thanh toán một phần";

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      SoTien: Number(form.SoTien),
      PhanTramDaThanhToan: percent,
      TrangThai: status
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/invoice/invoice/${selected.HoaDonID}`
        : "http://localhost:5000/api/invoice/addinvoice";

      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      setShowForm(false);
      fetchInvoices(search);
    } catch {
      alert("Lỗi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa?")) return;

    await fetch(`http://localhost:5000/api/invoice/invoice/${id}`, {
      method: "DELETE"
    });

    fetchInvoices(search);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🧾 Hóa đơn</h2>

        <div className="toolbar">
          <input
            placeholder="🔍 Tìm..."
            className="search"
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
            <th>Hợp đồng</th>
            <th>Số tiền</th>
            <th>Ngày lập</th>
            <th>%</th>
            <th>Trạng thái</th>
            <th>Hạn</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => {
            const hd = hopDongMap[i.HopDongID];

            return (
              <tr key={i.HoaDonID} onClick={() => handleOpenEdit(i)}>
                <td>{formatID(i.HoaDonID)}</td>
                <td>{hd?.MaHopDong || `HD${i.HopDongID}`}</td>
                <td>{i.SoTien.toLocaleString()}</td>
                <td>{new Date(i.NgayLap).toLocaleDateString()}</td>
                <td>{i.PhanTramDaThanhToan}%</td>
                <td>
                  <span className={`badge ${i.TrangThai}`}>
                    {i.TrangThai}
                  </span>
                </td>
                <td>
                  {i.HanThanhToan
                    ? new Date(i.HanThanhToan).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(i.HoaDonID); }}>
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "Sửa" : "Thêm"} hóa đơn</h3>

            <label>Hợp đồng *</label>
            <select name="HopDongID" value={form.HopDongID} onChange={handleChange}>
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID}`}
                </option>
              ))}
            </select>

            <label>Số tiền (VNĐ)</label>
            <input
              name="SoTien"
              type="number"
              value={form.SoTien}
              onChange={handleChange}
            />

            <label>Ngày lập</label>
            <input
              type="date"
              name="NgayLap"
              value={form.NgayLap}
              onChange={handleChange}
            />

            <label>Hạn thanh toán</label>
            <input
              type="date"
              name="HanThanhToan"
              value={form.HanThanhToan}
              onChange={handleChange}
            />

            <label>Đã thanh toán (%)</label>
            <input
              type="number"
              name="PhanTramDaThanhToan"
              min="0"
              max="100"
              value={form.PhanTramDaThanhToan}
              onChange={handleChange}
            />

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

export default Invoices;