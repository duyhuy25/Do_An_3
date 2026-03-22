import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Trip {
  ChuyenDiID: number;
  MaChuyen: string;
  CangDiID: string;
  CangDenID: string;
  NgayKhoiHanh: string;
  NgayDuKienDen: string;
  PhuongTienID: string;
  TrangThai: string;
}

const Trips: React.FC = () => {

  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Trip | null>(null);

  const [form, setForm] = useState({
    MaChuyen: "",
    CangDiID: "",
    CangDenID: "",
    NgayKhoiHanh: "",
    NgayDuKienDen: "",
    PhuongTienID: "",
    TrangThai: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/trip/trip");
    const data = await res.json();
    setTrips(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "TRP" + id.toString().padStart(3, "0");

  const filtered = trips.filter((t) =>
    t.MaChuyen.toLowerCase().includes(search.toLowerCase())
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
      MaChuyen: "",
      CangDiID: "",
      CangDenID: "",
      NgayKhoiHanh: "",
      NgayDuKienDen: "",
      PhuongTienID: "",
      TrangThai: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Trip) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      MaChuyen: item.MaChuyen,
      CangDiID: item.CangDiID,
      CangDenID: item.CangDenID,
      NgayKhoiHanh: item.NgayKhoiHanh,
      NgayDuKienDen: item.NgayDuKienDen,
      PhuongTienID: item.PhuongTienID,
      TrangThai: item.TrangThai
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = { ...form };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/trip/trip/${selected.ChuyenDiID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/trip/trip", {
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

    await fetch(`http://localhost:5000/api/trip/trip/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>🚢 Danh sách chuyến đi</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm chuyến..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm chuyến
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã chuyến</th>
            <th>Cảng đi</th>
            <th>Cảng đến</th>
            <th>ETD</th>
            <th>ETA</th>
            <th>Phương tiện</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t.ChuyenDiID} onClick={() => handleOpenEdit(t)}>
              <td>{formatID(t.ChuyenDiID)}</td>
              <td>{t.MaChuyen}</td>
              <td>{t.CangDiID}</td>
              <td>{t.CangDenID}</td>
              <td>{new Date(t.NgayKhoiHanh).toLocaleDateString()}</td>
              <td>{new Date(t.NgayDuKienDen).toLocaleDateString()}</td>
              <td>{t.PhuongTienID}</td>
              <td>{t.TrangThai}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(t);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.ChuyenDiID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} chuyến đi</h3>

            <input name="MaChuyen" placeholder="Mã chuyến" value={form.MaChuyen} onChange={handleChange} />
            <input name="CangDiID" placeholder="Cảng đi" value={form.CangDiID} onChange={handleChange} />
            <input name="CangDenID" placeholder="Cảng đến" value={form.CangDenID} onChange={handleChange} />
            <input name="NgayKhoiHanh" placeholder="Ngày khởi hành" value={form.NgayKhoiHanh} onChange={handleChange} />
            <input name="NgayDuKienDen" placeholder="Ngày dự kiến đến" value={form.NgayDuKienDen} onChange={handleChange} />
            <input name="PhuongTienID" placeholder="Phương tiện" value={form.PhuongTienID} onChange={handleChange} />
            <input name="TrangThai" placeholder="Trạng thái" value={form.TrangThai} onChange={handleChange} />

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

export default Trips;