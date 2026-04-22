import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface GPS {
  GPSID: number;
  ContainerID: number;
  ViDo: number;
  KinhDo: number;
  TocDo: number;
  ThoiGian: string;
}

interface ContainerOption {
  ContainerID: number;
}

const GPSContainers: React.FC = () => {
  const [gpsList, setGpsList] = useState<GPS[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<GPS | null>(null);

  const [form, setForm] = useState({
    ContainerID: "",
    ViDo: "",
    KinhDo: "",
    TocDo: "",
    ThoiGian: ""
  });

  const fetchGPS = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gps");
      if (!res.ok) throw new Error("Lỗi tải GPS");
      const data = await res.json();
      setGpsList(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();
      setContainers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGPS(), fetchContainers()])
      .finally(() => setLoading(false));
  }, [fetchGPS, fetchContainers]);

  const formatContainer = (id: number) =>
    "CTN" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      ContainerID: "",
      ViDo: "",
      KinhDo: "",
      TocDo: "",
      ThoiGian: ""
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: GPS) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      ContainerID: item.ContainerID.toString(),
      ViDo: item.ViDo.toString(),
      KinhDo: item.KinhDo.toString(),
      TocDo: item.TocDo.toString(),
      ThoiGian: item.ThoiGian.slice(0, 16) // format datetime-local
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.ContainerID || !form.ViDo || !form.KinhDo) {
      alert("Thiếu dữ liệu bắt buộc");
      return;
    }

    const body = {
      ContainerID: Number(form.ContainerID),
      ViDo: Number(form.ViDo),
      KinhDo: Number(form.KinhDo),
      TocDo: Number(form.TocDo || 0),
      ThoiGian: form.ThoiGian || new Date().toISOString()
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/gps/${selected.GPSID}`
        : "http://localhost:5000/api/gps";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowForm(false);
        fetchGPS();
      } else {
        alert("Lỗi server");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa GPS này?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/gps/${id}`, {
        method: "DELETE"
      });

      if (res.ok) fetchGPS();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📍 GPS Container</h2>
        <button className="btn-add" onClick={handleOpenAdd}>
          + Thêm GPS
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Container</th>
            <th>Vĩ độ</th>
            <th>Kinh độ</th>
            <th>Tốc độ</th>
            <th>Thời gian</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {gpsList.map(g => (
            <tr key={g.GPSID} onClick={() => handleOpenEdit(g)}>
              <td>{g.GPSID}</td>
              <td>{formatContainer(g.ContainerID)}</td>
              <td>{g.ViDo}</td>
              <td>{g.KinhDo}</td>
              <td>{g.TocDo}</td>
              <td>{new Date(g.ThoiGian).toLocaleString("vi-VN")}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(g); }}>
                  Sửa
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(g.GPSID); }}>
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
            <h3>{isEdit ? "Sửa GPS" : "Thêm GPS"}</h3>

            <label>Container *</label>
            <select name="ContainerID" value={form.ContainerID} onChange={handleChange}>
              <option value="">-- chọn --</option>
              {containers.map(c => (
                <option key={c.ContainerID} value={c.ContainerID}>
                  {formatContainer(c.ContainerID)}
                </option>
              ))}
            </select>

            <label>Vĩ độ *</label>
            <input name="ViDo" type="number" value={form.ViDo} onChange={handleChange} />

            <label>Kinh độ *</label>
            <input name="KinhDo" type="number" value={form.KinhDo} onChange={handleChange} />

            <label>Tốc độ</label>
            <input name="TocDo" type="number" value={form.TocDo} onChange={handleChange} />

            <label>Thời gian</label>
            <input name="ThoiGian" type="datetime-local" value={form.ThoiGian} onChange={handleChange} />

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

export default GPSContainers;