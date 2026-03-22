import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Invoice {
  HoaDonID: number;
  HopDongID: number;
  SoTien: number;
  NgayLap: string;
  PhanTramDaThanhToan: string;
}

const Invoices: React.FC = () => {

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const [form, setForm] = useState({
    HopDongID: "",
    SoTien: "",
    NgayLap: "",
    PhanTramDaThanhToan: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/invoice/invoice");
    const data = await res.json();
    setInvoices(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "HDN" + id.toString().padStart(3, "0");

  const filtered = invoices.filter((c) =>
    formatID(c.HoaDonID).includes(search)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      HopDongID: "",
      SoTien: "",
      NgayLap: "",
      PhanTramDaThanhToan: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Invoice) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      HopDongID: item.HopDongID.toString(),
      SoTien: item.SoTien.toString(),
      NgayLap: item.NgayLap,
      PhanTramDaThanhToan: item.PhanTramDaThanhToan
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      HopDongID: Number(form.HopDongID),
      SoTien: Number(form.SoTien)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/invoice/invoice/${selected.HoaDonID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/invoice/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`http://localhost:5000/api/invoice/invoice/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

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
            <th>Phần trăm thanh toán</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.HoaDonID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.HoaDonID)}</td>
              <td>{c.HopDongID}</td>
              <td>{c.SoTien.toLocaleString()}</td>
              <td>{new Date(c.NgayLap).toLocaleDateString()}</td>
              <td>{c.PhanTramDaThanhToan}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(c);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(c.HoaDonID);
                  }}
                >
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} hóa đơn</h3>

            <input name="HopDongID" placeholder="Hợp đồng" value={form.HopDongID} onChange={handleChange} />
            <input name="SoTien" placeholder="Số tiền" value={form.SoTien} onChange={handleChange} />
            <input name="NgayLap" placeholder="Ngày lập" value={form.NgayLap} onChange={handleChange} />
            <input name="PhanTramDaThanhToan" placeholder="Phần trăm thanh toán" value={form.PhanTramDaThanhToan} onChange={handleChange} />

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