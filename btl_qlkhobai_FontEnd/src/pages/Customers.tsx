import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Customer {
  KhachHangID: number;
  TenKH: string;
  DiaChi: string;
  SDT: string;
  Email: string;
}

const Customers: React.FC = () => {

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const [form, setForm] = useState({
    TenKH: "",
    DiaChi: "",
    SDT: "",
    Email: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/customer/customer");
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "KH" + id.toString().padStart(3, "0");

  const filtered = customers.filter((c) =>
    c.TenKH.toLowerCase().includes(search.toLowerCase())
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
      TenKH: "",
      DiaChi: "",
      SDT: "",
      Email: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Customer) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      TenKH: item.TenKH,
      DiaChi: item.DiaChi,
      SDT: item.SDT,
      Email: item.Email
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = { ...form };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/customer/customer/${selected.KhachHangID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/customer/customer", {
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

    await fetch(`http://localhost:5000/api/customer/customer/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>👥 Danh sách khách hàng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm khách hàng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm khách hàng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.KhachHangID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.KhachHangID)}</td>
              <td>{c.TenKH}</td>
              <td>{c.DiaChi}</td>
              <td>{c.SDT}</td>
              <td>{c.Email}</td>

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
                    handleDelete(c.KhachHangID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} khách hàng</h3>

            <input name="TenKH" placeholder="Tên khách hàng" value={form.TenKH} onChange={handleChange} />
            <input name="DiaChi" placeholder="Địa chỉ" value={form.DiaChi} onChange={handleChange} />
            <input name="SDT" placeholder="SĐT" value={form.SDT} onChange={handleChange} />
            <input name="Email" placeholder="Email" value={form.Email} onChange={handleChange} />

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

export default Customers;