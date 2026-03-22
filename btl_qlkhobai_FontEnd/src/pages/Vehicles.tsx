import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Vehicle {
  PhuongTienID: number;
  LoaiPhuongTien: string;
  BienSo: string;
  HinhAnh: string;
  TaiTrong: number;
  TrangThai: string;
  MoTa: string;
}

const Vehicles: React.FC = () => {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const [form, setForm] = useState({
    LoaiPhuongTien: "",
    BienSo: "",
    HinhAnh: "",
    TaiTrong: "",
    TrangThai: "",
    MoTa: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/vehicle/vehicle");
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "VH" + id.toString().padStart(3, "0");

  const filtered = vehicles.filter((v) =>
    v.BienSo.toLowerCase().includes(search.toLowerCase())
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
      LoaiPhuongTien: "",
      BienSo: "",
      HinhAnh: "",
      TaiTrong: "",
      TrangThai: "",
      MoTa: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Vehicle) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      LoaiPhuongTien: item.LoaiPhuongTien,
      BienSo: item.BienSo,
      HinhAnh: item.HinhAnh,
      TaiTrong: item.TaiTrong.toString(),
      TrangThai: item.TrangThai,
      MoTa: item.MoTa
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      TaiTrong: Number(form.TaiTrong)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/vehicle/vehicle/${selected.PhuongTienID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/vehicle/vehicle", {
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

    await fetch(`http://localhost:5000/api/vehicle/vehicle/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>🚚 Danh sách phương tiện</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm phương tiện..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm phương tiện
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại xe</th>
            <th>Biển số</th>
            <th>Hình ảnh</th>
            <th>Tải trọng</th>
            <th>Trạng thái</th>
            <th>Mô tả</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((v) => (
            <tr key={v.PhuongTienID} onClick={() => handleOpenEdit(v)}>
              <td>{formatID(v.PhuongTienID)}</td>
              <td>{v.LoaiPhuongTien}</td>
              <td>{v.BienSo}</td>
              <td>{v.HinhAnh}</td>
              <td>{v.TaiTrong}</td>
              <td>{v.TrangThai}</td>
              <td>{v.MoTa}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(v);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(v.PhuongTienID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} phương tiện</h3>

            <input name="LoaiPhuongTien" placeholder="Loại xe" value={form.LoaiPhuongTien} onChange={handleChange} />
            <input name="BienSo" placeholder="Biển số" value={form.BienSo} onChange={handleChange} />
            <input name="HinhAnh" placeholder="Hình ảnh" value={form.HinhAnh} onChange={handleChange} />
            <input name="TaiTrong" placeholder="Tải trọng" value={form.TaiTrong} onChange={handleChange} />
            <input name="TrangThai" placeholder="Trạng thái" value={form.TrangThai} onChange={handleChange} />
            <input name="MoTa" placeholder="Mô tả" value={form.MoTa} onChange={handleChange} />

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

export default Vehicles;