import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Invoice {
  HoaDonID: number;
  HopDongID: number;
  SoTien: number;
  NgayLap: string;
  PhanTramDaThanhToan: number;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
  TenKH?: string;
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
  });

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/invoice/invoice");
      if (!res.ok) throw new Error("Lỗi tải danh sách hóa đơn");
      const data = await res.json();
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải hóa đơn");
      console.error(err);
    }
  }, []);

  const fetchHopDongs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hopdong");
      const data = await res.json();
      setHopDongs(data);
    } catch (err) {
      console.error("Error fetching hop dong:", err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchInvoices(), fetchHopDongs()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchInvoices, fetchHopDongs]);

  const formatID = (id: number) => "HDN" + id.toString().padStart(3, "0");

  const filteredInvoices = invoices.filter((i) => {
    const searchLower = search.toLowerCase();
    const hd = hopDongs.find((h) => h.HopDongID === i.HopDongID);
    return (
      formatID(i.HoaDonID).toLowerCase().includes(searchLower) ||
      hd?.MaHopDong?.toLowerCase().includes(searchLower) ||
      i.SoTien.toString().includes(search) ||
      i.PhanTramDaThanhToan.toString().includes(search) ||
      (hd?.TenKH?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      HopDongID: "",
      SoTien: "",
      NgayLap: "",
      PhanTramDaThanhToan: "0",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Invoice) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      HopDongID: item.HopDongID.toString(),
      SoTien: item.SoTien.toString(),
      NgayLap: item.NgayLap ? item.NgayLap.slice(0, 10) : "",
      PhanTramDaThanhToan: item.PhanTramDaThanhToan.toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.HopDongID) {
      alert("Vui lòng chọn hợp đồng");
      return;
    }
    if (!form.SoTien || isNaN(Number(form.SoTien)) || Number(form.SoTien) <= 0) {
      alert("Số tiền phải là số dương hợp lệ");
      return;
    }
    if (!form.NgayLap) {
      alert("Vui lòng chọn ngày lập hóa đơn");
      return;
    }

    const phanTram = Number(form.PhanTramDaThanhToan);
    if (isNaN(phanTram) || phanTram < 0 || phanTram > 100) {
      alert("Phần trăm thanh toán phải từ 0 đến 100");
      return;
    }

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      SoTien: Number(form.SoTien),
      PhanTramDaThanhToan: phanTram,
      NgayLap: form.NgayLap || null,
    };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/invoice/invoice/${selected.HoaDonID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/invoice/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchInvoices();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Có lỗi khi lưu hóa đơn");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa hóa đơn này?")) return;

    try {
      await fetch(`http://localhost:5000/api/invoice/invoice/${id}`, {
        method: "DELETE",
      });
      fetchInvoices();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể xóa hóa đơn");
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🧾 Danh sách hóa đơn</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm hóa đơn (ID, hợp đồng, số tiền, % thanh toán...)"
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm hóa đơn
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hợp đồng</th>
            <th>Số tiền (VNĐ)</th>
            <th>Ngày lập</th>
            <th>% đã thanh toán</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filteredInvoices.map((i) => {
            const hd = hopDongs.find((h) => h.HopDongID === i.HopDongID);
            return (
              <tr key={i.HoaDonID} onClick={() => handleOpenEdit(i)}>
                <td>{formatID(i.HoaDonID)}</td>
                <td>
                  {hd
                    ? hd.MaHopDong || `HD${hd.HopDongID}`
                    : i.HopDongID}
                </td>
                <td>{i.SoTien.toLocaleString("vi-VN")}</td>
                <td>
                  {i.NgayLap
                    ? new Date(i.NgayLap).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td>{i.PhanTramDaThanhToan}%</td>

                <td>
                  <button
                    className="btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(i);
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(i.HoaDonID);
                    }}
                  >
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
            <h3>{isEdit ? "✏️ Sửa hóa đơn" : "➕ Thêm hóa đơn"}</h3>

            <label>Hợp đồng *</label>
            <select
              name="HopDongID"
              value={form.HopDongID}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID}`}
                  {hd.TenKH ? ` - ${hd.TenKH}` : ""}
                </option>
              ))}
            </select>

            <label>Số tiền (VNĐ) *</label>
            <input
              type="number"
              name="SoTien"
              placeholder="Nhập tổng số tiền hóa đơn"
              value={form.SoTien}
              onChange={handleChange}
              required
            />

            <label>Ngày lập *</label>
            <input
              type="date"
              name="NgayLap"
              value={form.NgayLap}
              onChange={handleChange}
              required
            />

            <label>Phần trăm đã thanh toán (%)</label>
            <input
              type="number"
              name="PhanTramDaThanhToan"
              placeholder="0 - 100"
              min="0"
              max="100"
              value={form.PhanTramDaThanhToan}
              onChange={handleChange}
            />

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

export default Invoices;