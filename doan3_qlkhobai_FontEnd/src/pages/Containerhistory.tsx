import React, { useEffect, useState, useCallback, ChangeEvent, useMemo } from "react";
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

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const groupedData = useMemo(() => {
    const groups: Record<number, History[]> = {};
    history.forEach(h => {
      if (!groups[h.ContainerID]) groups[h.ContainerID] = [];
      groups[h.ContainerID].push(h);
    });
    
    const masterRows = Object.keys(groups).map(cId => {
      const id = Number(cId);
      const logs = groups[id];
      logs.sort((a,b) => new Date(a.ThoiGian).getTime() - new Date(b.ThoiGian).getTime());
      const latest = logs[logs.length - 1];
      return {
        containerId: id,
        latestId: latest.LichSuID,
        hoatDong: latest.HoatDong,
        thoiGian: latest.ThoiGian,
        viTri: latest.ViTri,
        logs: logs
      };
    });
    
    masterRows.sort((a,b) => new Date(b.thoiGian).getTime() - new Date(a.thoiGian).getTime());
    
    return masterRows;
  }, [history]);

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

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Container</th>
            <th>Trạng thái gần nhất</th>
            <th>Cập nhật cuối</th>
            <th>Vị trí hiện hành</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map(group => (
            <React.Fragment key={group.containerId}>
              <tr 
                onClick={() => setExpandedId(expandedId === group.containerId ? null : group.containerId)}
                style={{ cursor: 'pointer', background: expandedId === group.containerId ? '#f0f8ff' : 'inherit' }}
              >
                <td>{expandedId === group.containerId ? '▼' : '▶'} LS{group.latestId.toString().padStart(3, '0')}</td>
                <td>{"CTN" + group.containerId.toString().padStart(3, "0")}</td>
                <td>{group.hoatDong}</td>
                <td>{new Date(group.thoiGian).toLocaleString('vi-VN')}</td>
                <td>{group.viTri || '-'}</td>
              </tr>
              {expandedId === group.containerId && (
                <tr className="expanded-row" style={{ background: '#f9f9f9' }}>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <div style={{ padding: '15px' }}>
                      <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>⏱ Lịch sử cập nhật: CTN{group.containerId.toString().padStart(3, '0')}</h4>
                      <table className="sub-table" style={{ width: '100%', margin: 0, boxShadow: 'none' }}>
                        <thead style={{ background: '#007bff', color: 'white' }}>
                          <tr>
                            <th>STT</th>
                            <th>Hành động</th>
                            <th>Thời gian</th>
                            <th>Vị trí</th>
                            <th>Tác vụ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.logs.map((log, index) => (
                            <tr key={log.LichSuID} style={{ background: 'white' }}>
                              <td>{index + 1}</td>
                              <td>{log.HoatDong}</td>
                              <td>{new Date(log.ThoiGian).toLocaleString('vi-VN')}</td>
                              <td>{log.ViTri || '-'}</td>
                              <td className="actions">
                                <div className="td-actions">
                                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(log); }}>Sửa</button>
                                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(log.LichSuID); }}>Xóa</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} lịch sử</h3>

            <label>Container *</label>
            <select name="ContainerID" value={form.ContainerID} onChange={handleChange}>
              <option value="">-- Chọn container --</option>
              {containers.map((c) => (
                <option key={c.ContainerID} value={c.ContainerID}>
                  {c.formattedID}
                </option>
              ))}
            </select>

            <label>Hoạt động *</label>
            <select name="HoatDong" value={form.HoatDong} onChange={handleChange}>
              <option value="">-- Chọn hoạt động --</option>
              <option value="TẠO">Tạo</option>
              <option value="ĐÓNG HÀNG">Đóng hàng</option>
              <option value="NHẬP KHO">Nhập kho</option>
              <option value="PHÂN CÔNG">Phân công</option>
              <option value="VẬN CHUYỂN">Vận chuyển</option>
              <option value="THEO DÕI">Theo dõi</option>
              <option value="ĐẾN NƠI">Đến nơi</option>
              <option value="HOÀN THÀNH">Hoàn thành</option>
            </select>

            <label>Thời gian</label>
            <input
              type="datetime-local"
              name="ThoiGian"
              value={form.ThoiGian}
              onChange={handleChange}
            />

            <label>Vị trí</label>
            <input name="ViTri" value={form.ViTri} onChange={handleChange} />

            <label>Trạng thái cũ</label>
            <input name="TrangThaiCu" value={form.TrangThaiCu} onChange={handleChange} />

            <label>Trạng thái mới</label>
            <input name="TrangThaiMoi" value={form.TrangThaiMoi} onChange={handleChange} />

            <label>Người cập nhật</label>
            <input name="NguoiCapNhat" value={form.NguoiCapNhat} onChange={handleChange} />

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

export default ContainerHistory;