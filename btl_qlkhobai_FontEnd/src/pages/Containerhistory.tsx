import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface History {
  LichSuID: number;
  ContainerID: number;
  HoatDong: string;
  ThoiGian: string;
  ViTri: string;
}

interface ContainerOption {
  ContainerID: number;
  formattedID: string;
}

const ContainerHistory: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<History | null>(null);

  const [form, setForm] = useState({
    ContainerID: "",
    HoatDong: "",
    ThoiGian: "",
    ViTri: ""
  });

  // --------------------------
  // FETCH HISTORY
  // --------------------------
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/history/containerhistory");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  }, []);

  // --------------------------
  // FETCH CONTAINERS
  // --------------------------
  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();

      const formatted = data.map((c: any) => ({
        ContainerID: c.ContainerID,
        formattedID: "CTN" + c.ContainerID.toString().padStart(3, "0")
      }));

      setContainers(formatted);
    } catch (err) {
      console.error("Error fetching containers:", err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchContainers();
  }, [fetchHistory, fetchContainers]);

  const formatID = (id: number) => "LS" + id.toString().padStart(3, "0");

  // Search
  const filteredHistory = history.filter(
    (h) =>
      formatID(h.LichSuID).includes(search) ||
      h.ContainerID.toString().includes(search)
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      ContainerID: "",
      HoatDong: "",
      ThoiGian: "",
      ViTri: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: History) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      ContainerID: item.ContainerID.toString(),
      HoatDong: item.HoatDong,
      ThoiGian: item.ThoiGian.slice(0, 16),
      ViTri: item.ViTri
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const body = {
      ...form,
      ContainerID: Number(form.ContainerID),
    };

    try {
      if (isEdit && selected) {
        await fetch(`http://localhost:5000/api/history/containerhistory/${selected.LichSuID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      } else {
        await fetch("http://localhost:5000/api/history/containerhistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      }

      setShowForm(false);
      fetchHistory();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/api/history/containerhistory/${id}`, {
        method: "DELETE"
      });
      fetchHistory();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <div className="header">
        <h2>📜 Lịch sử Container</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm lịch sử container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm lịch sử
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Container</th>
            <th>Hành động</th>
            <th>Thời gian</th>
            <th>Vị trí</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filteredHistory.map((h) => (
            <tr key={h.LichSuID} onClick={() => handleOpenEdit(h)}>
              <td>{formatID(h.LichSuID)}</td>
              <td>{"CTN" + h.ContainerID.toString().padStart(3, "0")}</td>
              <td>{h.HoatDong}</td>
              <td>{new Date(h.ThoiGian).toLocaleString()}</td>
              <td>{h.ViTri}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(h);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(h.LichSuID);
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
            <h3>{isEdit ? "Sửa Lịch Sử" : "Thêm Lịch Sử"}</h3>

            <label>Container</label>
            <select
              name="ContainerID"
              value={form.ContainerID}
              onChange={handleChange}
            >
              <option value="">-- Chọn container --</option>
              {containers.map((c) => (
                <option key={c.ContainerID} value={c.ContainerID}>
                  {c.formattedID}
                </option>
              ))}
            </select>

            <label>Hành động</label>
            <select
              name="HoatDong"
              value={form.HoatDong}
              onChange={handleChange}
            >
              <option value="">-- Chọn --</option>
              <option value="Nhập kho">Nhập kho</option>
              <option value="Xuất kho">Xuất kho</option>
              <option value="Di chuyển">Di chuyển</option>
            </select>

            <label>Thời gian</label>
            <input
              type="datetime-local"
              name="ThoiGian"
              value={form.ThoiGian}
              onChange={handleChange}
            />

            <label>Vị trí</label>
            <input
              name="ViTri"
              placeholder="Nhập vị trí..."
              value={form.ViTri}
              onChange={handleChange}
            />

            <button className="btn-submit" onClick={handleSubmit}>
              {isEdit ? "Lưu thay đổi" : "Lưu"}
            </button>

            <button className="btn-cancel" onClick={() => setShowForm(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerHistory;