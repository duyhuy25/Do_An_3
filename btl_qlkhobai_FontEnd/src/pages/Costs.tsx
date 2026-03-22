import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Cost {
  ChiPhiID: number;
  HopDongID: number;
  ContainerID: number | null;
  LoaiChiPhi: string;
  SoTien: number;
  ThuKhachHang: string;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
  TenKH?: string;
}

interface ContainerOption {
  ContainerID: number;
  formattedID: string;
}

const Costs: React.FC = () => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Cost | null>(null);

  const [form, setForm] = useState({
    HopDongID: "",
    ContainerID: "",
    LoaiChiPhi: "",
    SoTien: "",
    ThuKhachHang: "Không",
  });

  const fetchCosts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cost/cost");
      if (!res.ok) throw new Error("Lỗi tải danh sách chi phí");
      const data = await res.json();
      setCosts(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi phí");
      console.error(err);
    }
  }, []);

  const fetchHopDongs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hopdong");
      const data = await res.json();
      setHopDongs(data);
    } catch (err) {
      console.error("Error fetching hop dong:", err);
    }
  }, []);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();
      const formatted = data.map((c: any) => ({
        ContainerID: c.ContainerID,
        formattedID: "CTN" + c.ContainerID.toString().padStart(3, "0"),
      }));
      setContainers(formatted);
    } catch (err) {
      console.error("Error fetching containers:", err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchCosts(), fetchHopDongs(), fetchContainers()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchCosts, fetchHopDongs, fetchContainers]);

  const formatID = (id: number) => "CP" + id.toString().padStart(3, "0");

  const filteredCosts = costs.filter((c) => {
    const searchLower = search.toLowerCase();
    const hd = hopDongs.find((h) => h.HopDongID === c.HopDongID);
    const ct = containers.find((ctn) => ctn.ContainerID === c.ContainerID);
    return (
      formatID(c.ChiPhiID).toLowerCase().includes(searchLower) ||
      c.LoaiChiPhi.toLowerCase().includes(searchLower) ||
      c.SoTien.toString().includes(search) ||
      hd?.MaHopDong?.toLowerCase().includes(searchLower) ||
      ct?.formattedID.toLowerCase().includes(searchLower) ||
      c.ThuKhachHang.toLowerCase().includes(searchLower)
    );
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
      ThuKhachHang: "Không",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Cost) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      HopDongID: item.HopDongID.toString(),
      ContainerID: item.ContainerID ? item.ContainerID.toString() : "",
      LoaiChiPhi: item.LoaiChiPhi,
      SoTien: item.SoTien.toString(),
      ThuKhachHang: item.ThuKhachHang,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.HopDongID) {
      alert("Vui lòng chọn hợp đồng");
      return;
    }
    if (!form.LoaiChiPhi.trim()) {
      alert("Vui lòng nhập loại chi phí");
      return;
    }
    if (!form.SoTien || isNaN(Number(form.SoTien)) || Number(form.SoTien) <= 0) {
      alert("Số tiền phải là số dương hợp lệ");
      return;
    }

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      ContainerID: form.ContainerID ? Number(form.ContainerID) : null,
      SoTien: Number(form.SoTien),
    };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/cost/cost/${selected.ChiPhiID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/cost/cost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchCosts();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Có lỗi khi lưu chi phí");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa chi phí này?")) return;

    try {
      await fetch(`http://localhost:5000/api/cost/cost/${id}`, {
        method: "DELETE",
      });
      fetchCosts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể xóa chi phí");
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>💰 Danh sách chi phí</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm chi phí (loại, hợp đồng, container, số tiền...)"
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
            <th>Số tiền (VNĐ)</th>
            <th>Thu khách hàng</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filteredCosts.map((c) => {
            const hd = hopDongs.find((h) => h.HopDongID === c.HopDongID);
            const ct = containers.find((ctn) => ctn.ContainerID === c.ContainerID);
            return (
              <tr key={c.ChiPhiID} onClick={() => handleOpenEdit(c)}>
                <td>{formatID(c.ChiPhiID)}</td>
                <td>
                  {hd
                    ? hd.MaHopDong || `HD${hd.HopDongID}`
                    : c.HopDongID}
                </td>
                <td>{ct ? ct.formattedID : "-"}</td>
                <td>{c.LoaiChiPhi}</td>
                <td>{c.SoTien.toLocaleString("vi-VN")}</td>
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
            );
          })}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "✏️ Sửa chi phí" : "➕ Thêm chi phí"}</h3>

            <label>Hợp đồng *</label>
            <select
              name="HopDongID"
              value={form.HopDongID}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID}`}
                  {hd.TenKH ? ` - ${hd.TenKH}` : ""}
                </option>
              ))}
            </select>

            <label>Container</label>
            <select name="ContainerID" value={form.ContainerID} onChange={handleChange}>
              <option value="">-- Không gắn container --</option>
              {containers.map((ct) => (
                <option key={ct.ContainerID} value={ct.ContainerID}>
                  {ct.formattedID}
                </option>
              ))}
            </select>

            <label>Loại chi phí *</label>
            <input
              name="LoaiChiPhi"
              placeholder="Ví dụ: Phí vận chuyển, Phí lưu kho, Phí THC..."
              value={form.LoaiChiPhi}
              onChange={handleChange}
              required
            />

            <label>Số tiền (VNĐ) *</label>
            <input
              type="number"
              name="SoTien"
              placeholder="Nhập số tiền"
              value={form.SoTien}
              onChange={handleChange}
              required
            />

            <label>Thu khách hàng</label>
            <select
              name="ThuKhachHang"
              value={form.ThuKhachHang}
              onChange={handleChange}
            >
              <option value="Không">Không</option>
              <option value="Có">Có</option>
            </select>

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