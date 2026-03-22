import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Cost {
  ChiPhiID: number;
  HopDongID: number;
  ContainerID: number;
  LoaiChiPhi: string;
  SoTien: number;
  ThuKhachHang: string;
}

const Costs: React.FC = () => {

  const [costs, setCosts] = useState<Cost[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Cost | null>(null);

  const [form, setForm] = useState({
    HopDongID: "",
    ContainerID: "",
    LoaiChiPhi: "",
    SoTien: "",
    ThuKhachHang: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/cost/cost");
    const data = await res.json();
    setCosts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "CP" + id.toString().padStart(3, "0");

  const filtered = costs.filter((c) =>
    c.LoaiChiPhi.toLowerCase().includes(search.toLowerCase())
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
      ContainerID: "",
      LoaiChiPhi: "",
      SoTien: "",
      ThuKhachHang: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Cost) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      HopDongID: item.HopDongID.toString(),
      ContainerID: item.ContainerID.toString(),
      LoaiChiPhi: item.LoaiChiPhi,
      SoTien: item.SoTien.toString(),
      ThuKhachHang: item.ThuKhachHang
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      HopDongID: Number(form.HopDongID),
      ContainerID: Number(form.ContainerID),
      SoTien: Number(form.SoTien)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/cost/cost/${selected.ChiPhiID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/cost/cost", {
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

    await fetch(`http://localhost:5000/api/cost/cost/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>💰 Danh sách chi phí</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm chi phí..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm chi phí
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hợp đồng</th>
            <th>Container</th>
            <th>Loại chi phí</th>
            <th>Số tiền</th>
            <th>Thu khách hàng</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.ChiPhiID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.ChiPhiID)}</td>
              <td>{c.HopDongID}</td>
              <td>{c.ContainerID}</td>
              <td>{c.LoaiChiPhi}</td>
              <td>{c.SoTien.toLocaleString()}</td>
              <td>{c.ThuKhachHang}</td>

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
                    handleDelete(c.ChiPhiID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} chi phí</h3>

            <input name="HopDongID" placeholder="Hợp đồng" value={form.HopDongID} onChange={handleChange} />
            <input name="ContainerID" placeholder="Container" value={form.ContainerID} onChange={handleChange} />
            <input name="LoaiChiPhi" placeholder="Loại chi phí" value={form.LoaiChiPhi} onChange={handleChange} />
            <input name="SoTien" placeholder="Số tiền" value={form.SoTien} onChange={handleChange} />
            <input name="ThuKhachHang" placeholder="Thu khách hàng" value={form.ThuKhachHang} onChange={handleChange} />

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

export default Costs;