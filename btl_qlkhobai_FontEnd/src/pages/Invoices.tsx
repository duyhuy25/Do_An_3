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
      setError(err.message || "Không thể tải hóa đơn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHopDongs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contract/contract");
      const data = await res.json();
      setHopDongs(data);
    } catch (err) {
      console.error(err);
    }
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
      alert("Số tiền phải là số dương");
      return;
    }

    if (!form.NgayLap) {
      alert("Vui lòng chọn ngày lập");
      return;
    }

    const percent = Number(form.PhanTramDaThanhToan);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      alert("Phần trăm phải từ 0 đến 100");
      return;
    }

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      SoTien: Number(form.SoTien),
      PhanTramDaThanhToan: percent,
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
        await fetch("http://localhost:5000/api/invoice/addinvoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchInvoices(search);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu hóa đơn");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/api/invoice/invoice/${id}`, {
        method: "DELETE",
      });

      fetchInvoices(search);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa");
    }
  };

  {loading && <div className="loading">Đang tải...</div>}
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🧾 Danh sách hóa đơn</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm hóa đơn..."
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
            <th>Số tiền</th>
            <th>Ngày lập</th>
            <th>% thanh toán</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => {
            const hd = hopDongMap[i.HopDongID];

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
            >
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID}`}
                </option>
              ))}
            </select>

            <label>Số tiền *</label>
            <input
              type="number"
              name="SoTien"
              value={form.SoTien}
              onChange={handleChange}
            />

            <label>Ngày lập *</label>
            <input
              type="date"
              name="NgayLap"
              value={form.NgayLap}
              onChange={handleChange}
            />

            <label>% thanh toán</label>
            <input
              type="number"
              name="PhanTramDaThanhToan"
              min="0"
              max="100"
              value={form.PhanTramDaThanhToan}
              onChange={handleChange}
            />

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

export default Invoices;