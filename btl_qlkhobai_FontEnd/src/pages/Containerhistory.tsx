import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface History {
  LichSuID: number;
  ContainerID: number;
  HoatDong: string;
  ThoiGian: string;
  ViTri: string;
  TrangThaiCu?: string;
  TrangThaiMoi?: string;
  NguoiCapNhat?: string;
}

interface ContainerOption {
  ContainerID: number;
  formattedID: string;
}

const ContainerHistory: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<History | null>(null);

  const [form, setForm] = useState({
    ContainerID: "",
    HoatDong: "",
    ThoiGian: "",
    ViTri: "",
    TrangThaiCu: "",
    TrangThaiMoi: "",
    NguoiCapNhat: ""
  });

  const fetchHistory = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/history/containerhistory/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/history/containerhistory";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải lịch sử");

      const data = await res.json();

      const clean = data
        .filter((i: any) => i.LichSuID && i.ContainerID)
        .sort((a: History, b: History) => a.LichSuID - b.LichSuID);

      setHistory(clean);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchContainers();
  }, [fetchHistory, fetchContainers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchHistory(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchHistory]);

  const formatID = (id?: number) =>
    id ? "LS" + id.toString().padStart(3, "0") : "LS---";

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
      ViTri: "",
      TrangThaiCu: "",
      TrangThaiMoi: "",
      NguoiCapNhat: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: History) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      ContainerID: item.ContainerID.toString(),
      HoatDong: item.HoatDong,
      ThoiGian: item.ThoiGian
        ? new Date(item.ThoiGian).toISOString().slice(0, 16)
        : "",
      ViTri: item.ViTri || "",
      TrangThaiCu: item.TrangThaiCu || "",
      TrangThaiMoi: item.TrangThaiMoi || "",
      NguoiCapNhat: item.NguoiCapNhat || ""
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.ContainerID || !form.HoatDong || !form.ThoiGian) {
      alert("Vui lòng nhập đủ thông tin bắt buộc!");
      return;
    }

    const body = {
      ...form,
      ContainerID: Number(form.ContainerID)
    };

    try {
      let res: Response;

      if (isEdit && selected) {
        res = await fetch(
          `http://localhost:5000/api/history/containerhistory/${selected.LichSuID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
      } else {
        res = await fetch(
          "http://localhost:5000/api/history/addcontainerhistory",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
      }

      if (!res.ok) throw new Error("Lỗi server");

      alert(isEdit ? "Cập nhật thành công!" : "Thêm thành công!");
      setShowForm(false);
      fetchHistory(search);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/history/containerhistory/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      fetchHistory(search);
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📜 Lịch sử Container</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            className="search"
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
            <th>Hành động</th>
            <th>Thời gian</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Người cập nhật</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {history.map((h) => (
            <tr key={h.LichSuID} onClick={() => handleOpenEdit(h)}>
              <td>{formatID(h.LichSuID)}</td>
              <td>{"CTN" + h.ContainerID.toString().padStart(3, "0")}</td>
              <td>{h.HoatDong}</td>
              <td>{new Date(h.ThoiGian).toLocaleString("vi-VN")}</td>
              <td>{h.ViTri || "-"}</td>
              <td>
                {h.TrangThaiCu} → {h.TrangThaiMoi}
              </td>
              <td>{h.NguoiCapNhat || "-"}</td>

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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} lịch sử</h3>

            <select name="ContainerID" value={form.ContainerID} onChange={handleChange}>
              <option value="">-- Chọn container --</option>
              {containers.map((c) => (
                <option key={c.ContainerID} value={c.ContainerID}>
                  {c.formattedID}
                </option>
              ))}
            </select>

            <input name="HoatDong" value={form.HoatDong} onChange={handleChange} placeholder="Hành động" />

            <input type="datetime-local" name="ThoiGian" value={form.ThoiGian} onChange={handleChange} />

            <input name="ViTri" value={form.ViTri} onChange={handleChange} placeholder="Vị trí" />

            <input name="TrangThaiCu" value={form.TrangThaiCu} onChange={handleChange} placeholder="Trạng thái cũ" />

            <input name="TrangThaiMoi" value={form.TrangThaiMoi} onChange={handleChange} placeholder="Trạng thái mới" />

            <input name="NguoiCapNhat" value={form.NguoiCapNhat} onChange={handleChange} placeholder="Người cập nhật" />

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>
                Lưu
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

export default ContainerHistory;