import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Assignment {
  ID: number;
  ContainerID: number;
  ChuyenDiID: number;
  ThoiGianPhanCong: string;
  TrangThai: string;
}

interface ContainerOption {
  ContainerID: number;
}

interface TripOption {
  ChuyenDiID: number;
}

const AssignmentContainers: React.FC = () => {
  const [list, setList] = useState<Assignment[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);

  const [form, setForm] = useState({
    ContainerID: "",
    ChuyenDiID: "",
    ThoiGianPhanCong: "",
    TrangThai: "Đã phân công"
  });

  const fetchData = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/assignment/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/assignment";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");

      const data = await res.json();
      setList(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const [c, t] = await Promise.all([
        fetch("http://localhost:5000/api/container/container").then(r => r.json()),
        fetch("http://localhost:5000/api/trip/trip").then(r => r.json())
      ]);
      setContainers(c);
      setTrips(t);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchData]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchData(), fetchOptions()])
      .finally(() => setLoading(false));
  }, [fetchData, fetchOptions]);

  const formatContainer = (id: number) =>
    "CTN" + id.toString().padStart(3, "0");

  const formatTrip = (id: number) =>
    "CD" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      ContainerID: "",
      ChuyenDiID: "",
      ThoiGianPhanCong: "",
      TrangThai: "Đã phân công"
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Assignment) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      ContainerID: item.ContainerID.toString(),
      ChuyenDiID: item.ChuyenDiID.toString(),
      ThoiGianPhanCong: item.ThoiGianPhanCong.slice(0, 16),
      TrangThai: item.TrangThai
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.ContainerID || !form.ChuyenDiID) {
      alert("Thiếu dữ liệu bắt buộc");
      return;
    }

    const body = {
      ContainerID: Number(form.ContainerID),
      ChuyenDiID: Number(form.ChuyenDiID),
      ThoiGianPhanCong: form.ThoiGianPhanCong || new Date().toISOString(),
      TrangThai: form.TrangThai
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/assignment/${selected.ID}`
        : "http://localhost:5000/api/assignment";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowForm(false);
        fetchData(search);
      } else {
        alert("Lỗi server");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa phân công này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/assignment/${id}`, {
        method: "DELETE"
      });

      if (res.ok) fetchData(search);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📦➡️🚚 Phân công Container</h2>
        <div className="toolbar">
          <input
            className="search"
            placeholder="🔍 Tìm kiếm..."
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
            <th>Container</th>
            <th>Chuyến đi</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a.ID} onClick={() => handleOpenEdit(a)}>
              <td>{a.ID}</td>
              <td>{formatContainer(a.ContainerID)}</td>
              <td>{formatTrip(a.ChuyenDiID)}</td>
              <td>{new Date(a.ThoiGianPhanCong).toLocaleString("vi-VN")}</td>
              <td>{a.TrangThai}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(a); }}>
                  Sửa
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(a.ID); }}>
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
            <h3>{isEdit ? "Sửa phân công" : "Thêm phân công"}</h3>

            <label>Container *</label>
            <select name="ContainerID" value={form.ContainerID} onChange={handleChange}>
              <option value="">-- chọn --</option>
              {containers.map(c => (
                <option key={c.ContainerID} value={c.ContainerID}>
                  {formatContainer(c.ContainerID)}
                </option>
              ))}
            </select>

            <label>Chuyến đi *</label>
            <select name="ChuyenDiID" value={form.ChuyenDiID} onChange={handleChange}>
              <option value="">-- chọn --</option>
              {trips.map(t => (
                <option key={t.ChuyenDiID} value={t.ChuyenDiID}>
                  {formatTrip(t.ChuyenDiID)}
                </option>
              ))}
            </select>

            <label>Thời gian</label>
            <input
              type="datetime-local"
              name="ThoiGianPhanCong"
              value={form.ThoiGianPhanCong}
              onChange={handleChange}
            />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Đã phân công">Đã phân công</option>
              <option value="Đang vận chuyển">Đang vận chuyển</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Hủy">Hủy</option>
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

export default AssignmentContainers;