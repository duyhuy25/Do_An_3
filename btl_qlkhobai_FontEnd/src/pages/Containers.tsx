import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Container {
  ContainerID: number;
  HopDongID: number;
  LoaiHangID: number;
  TrongLuong: number;
  TrangThai: string;
  KhoID: number | null;
  PhuongTienID: number | null;

}

interface LoaiHangOption {
  LoaiHangID: number;
  TenLoai: string;
}

interface KhoOption {
  KhoID: number;
  TenKho: string;
}

interface PhuongTienOption {
  PhuongTienID: number;
  BienSo: string;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
  TenKH?: string;     
}

const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loaiHangs, setLoaiHangs] = useState<LoaiHangOption[]>([]);
  const [khos, setKhos] = useState<KhoOption[]>([]);
  const [phuongTiens, setPhuongTiens] = useState<PhuongTienOption[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);

  const [form, setForm] = useState({
    LoaiHangID: "",
    TrongLuong: "",
    TrangThai: "Rỗng",
    KhoID: "",
    PhuongTienID: "",
    HopDongID: "",
  });


  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      if (!res.ok) throw new Error("Lỗi tải danh sách container");
      const data = await res.json();
      setContainers(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải container");
      console.error(err);
    }
  }, []);

  const fetchLoaiHangs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/itemtype/itemtype"); 
      const data = await res.json();
      setLoaiHangs(data);
    } catch (err) {
      console.error("Error fetching loai hang:", err);
    }
  }, []);

  const fetchKhos = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/warehouse/warehouse");
      const data = await res.json();
      setKhos(data);
    } catch (err) {
      console.error("Error fetching kho:", err);
    }
  }, []);

  const fetchPhuongTiens = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vehicle/vehicle");
      const data = await res.json();
      setPhuongTiens(data);
    } catch (err) {
      console.error("Error fetching phuong tien:", err);
    }
  }, []);

  const fetchHopDongs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contract/contract");
      const data = await res.json();
      setHopDongs(data);
    } catch (err) {
      console.error("Error fetching hop dong:", err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchContainers(),
        fetchLoaiHangs(),
        fetchKhos(),
        fetchPhuongTiens(),
        fetchHopDongs(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [fetchContainers, fetchLoaiHangs, fetchKhos, fetchPhuongTiens, fetchHopDongs]);

  const formatID = (id: number) => "CTN" + id.toString().padStart(3, "0");

  const filteredContainers = containers.filter((c) => {
    const searchLower = search.toLowerCase();
    return (
      formatID(c.ContainerID).toLowerCase().includes(searchLower) ||
      c.TrangThai.toLowerCase().includes(searchLower) ||
      c.TrongLuong.toString().includes(search) ||
      (c.HopDongID && c.HopDongID.toString().includes(search))
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
      LoaiHangID: "",
      TrongLuong: "",
      TrangThai: "Rỗng",
      KhoID: "",
      PhuongTienID: "",
      HopDongID: "",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Container) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      LoaiHangID: item.LoaiHangID.toString(),
      TrongLuong: item.TrongLuong.toString(),
      TrangThai: item.TrangThai,
      KhoID: item.KhoID ? item.KhoID.toString() : "",
      PhuongTienID: item.PhuongTienID ? item.PhuongTienID.toString() : "",
      HopDongID: item.HopDongID.toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.LoaiHangID) {
      alert("Vui lòng chọn loại hàng");
      return;
    }
    if (!form.HopDongID) {
      alert("Vui lòng chọn hợp đồng");
      return;
    }
    if (!form.TrongLuong || isNaN(Number(form.TrongLuong))) {
      alert("Trọng lượng phải là số hợp lệ");
      return;
    }

    const body = {
      ...form,
      LoaiHangID: Number(form.LoaiHangID),
      TrongLuong: Number(form.TrongLuong),
      HopDongID: Number(form.HopDongID),
      KhoID: form.KhoID ? Number(form.KhoID) : null,
      PhuongTienID: form.PhuongTienID ? Number(form.PhuongTienID) : null,
    };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/container/container/${selected.ContainerID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/container/addcontainer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
    
      setShowForm(false);
      fetchContainers();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Có lỗi xảy ra khi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa container này?")) return;
  
    try {
      await fetch(`http://localhost:5000/api/container/container/${id}`, {
        method: "DELETE",
      });
      fetchContainers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể xóa container");
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📦 Danh sách Container</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm container (ID, trạng thái, trọng lượng...)"
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm container
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại hàng</th>
            <th>Trọng lượng (kg)</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>Phương tiện</th>
            <th>Hợp đồng</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filteredContainers.map((c) => (
            <tr key={c.ContainerID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.ContainerID)}</td>
              <td>
                {loaiHangs.find((lh) => lh.LoaiHangID === c.LoaiHangID)?.TenLoai ||
                  c.LoaiHangID}
              </td>
              <td>{c.TrongLuong.toLocaleString("vi-VN")}</td>
              <td>{c.TrangThai}</td>
              <td>
                {khos.find((k) => k.KhoID === c.KhoID)?.TenKho || "-"}
              </td>
              <td>
                {phuongTiens.find((pt) => pt.PhuongTienID === c.PhuongTienID)
                  ?.BienSo || "-"}
              </td>
              <td>
                {hopDongs.find((hd) => hd.HopDongID === c.HopDongID)?.MaHopDong ||
                  c.HopDongID}
              </td>

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
                    handleDelete(c.ContainerID);
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
            <h3>{isEdit ? "✏️ Sửa Container" : "➕ Thêm Container"}</h3>

            <label>Loại hàng *</label>
            <select
              name="LoaiHangID"
              value={form.LoaiHangID}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn loại hàng --</option>
              {loaiHangs.map((lh) => (
                <option key={lh.LoaiHangID} value={lh.LoaiHangID}>
                  {lh.TenLoai}
                </option>
              ))}
            </select>

            <label>Trọng lượng (kg) *</label>
            <input
              type="number"
              name="TrongLuong"
              placeholder="Nhập trọng lượng"
              value={form.TrongLuong}
              onChange={handleChange}
              required
            />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Rỗng">Rỗng</option>
              <option value="Đầy">Đầy</option>
              <option value="Đang vận chuyển">Đang vận chuyển</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Hỏng">Hỏng</option>
            </select>

            <label>Kho</label>
            <select name="KhoID" value={form.KhoID} onChange={handleChange}>
              <option value="">-- Chưa nhập kho --</option>
              {khos.map((k) => (
                <option key={k.KhoID} value={k.KhoID}>
                  {k.TenKho}
                </option>
              ))}
            </select>

            <label>Phương tiện</label>
            <select name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange}>
              <option value="">-- Chưa gắn phương tiện --</option>
              {phuongTiens.map((pt) => (
                <option key={pt.PhuongTienID} value={pt.PhuongTienID}>
                  {pt.BienSo}
                </option>
              ))}
            </select>

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

export default Containers;