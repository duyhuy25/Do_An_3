import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Contract {
  HopDongID: number;
  KhachHangID: number;
  NgayKy: string;
  NgayHetHan: string | null;
  LoaiDichVu: string;
  GiaTri: number;
  TrangThai: string;
}

interface KhachHangOption {
  KhachHangID: number;
  TenKH: string;
  SDT: string;
}

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [khachHangs, setKhachHangs] = useState<KhachHangOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Contract | null>(null);

  const [form, setForm] = useState({
    KhachHangID: "",
    NgayKy: "",
    NgayHetHan: "",
    LoaiDichVu: "",
    GiaTri: "",
    TrangThai: "Đang hoạt động",
  });

  const fetchContracts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contract/contract");
      if (!res.ok) throw new Error("Lỗi tải danh sách hợp đồng");
      const data = await res.json();
      setContracts(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải hợp đồng");
      console.error(err);
    }
  }, []);

  const fetchKhachHangs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/khachhang");
      const data = await res.json();
      setKhachHangs(data);
    } catch (err) {
      console.error("Error fetching khach hang:", err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchContracts(), fetchKhachHangs()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchContracts, fetchKhachHangs]);

  const formatID = (id: number) => "HD" + id.toString().padStart(3, "0");

  const filteredContracts = contracts.filter((c) => {
    const searchLower = search.toLowerCase();
    const kh = khachHangs.find((k) => k.KhachHangID === c.KhachHangID);
    return (
      formatID(c.HopDongID).toLowerCase().includes(searchLower) ||
      kh?.TenKH.toLowerCase().includes(searchLower) ||
      c.LoaiDichVu.toLowerCase().includes(searchLower) ||
      c.TrangThai.toLowerCase().includes(searchLower) ||
      c.GiaTri.toString().includes(search)
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
      KhachHangID: "",
      NgayKy: "",
      NgayHetHan: "",
      LoaiDichVu: "",
      GiaTri: "",
      TrangThai: "Đang hoạt động",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Contract) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      KhachHangID: item.KhachHangID.toString(),
      NgayKy: item.NgayKy ? item.NgayKy.slice(0, 10) : "",
      NgayHetHan: item.NgayHetHan ? item.NgayHetHan.slice(0, 10) : "",
      LoaiDichVu: item.LoaiDichVu,
      GiaTri: item.GiaTri.toString(),
      TrangThai: item.TrangThai,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.KhachHangID) {
      alert("Vui lòng chọn khách hàng");
      return;
    }
    if (!form.NgayKy) {
      alert("Vui lòng chọn ngày ký");
      return;
    }
    if (!form.GiaTri || isNaN(Number(form.GiaTri))) {
      alert("Giá trị phải là số hợp lệ");
      return;
    }

    const body = {
      ...form,
      KhachHangID: Number(form.KhachHangID),
      GiaTri: Number(form.GiaTri),
      NgayKy: form.NgayKy || null,
      NgayHetHan: form.NgayHetHan || null,
    };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/contract/contract/${selected.HopDongID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/contract/contract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchContracts();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Có lỗi khi lưu hợp đồng");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa hợp đồng này?")) return;

    try {
      await fetch(`http://localhost:5000/api/contract/contract/${id}`, {
        method: "DELETE",
      });
      fetchContracts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Không thể xóa hợp đồng");
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📄 Danh sách hợp đồng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm hợp đồng (ID, khách hàng, loại dịch vụ...)"
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm hợp đồng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày ký</th>
            <th>Ngày hết hạn</th>
            <th>Loại dịch vụ</th>
            <th>Giá trị (VNĐ)</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filteredContracts.map((c) => {
            const kh = khachHangs.find((k) => k.KhachHangID === c.KhachHangID);
            return (
              <tr key={c.HopDongID} onClick={() => handleOpenEdit(c)}>
                <td>{formatID(c.HopDongID)}</td>
                <td>{kh ? `${kh.TenKH} (${kh.SDT})` : c.KhachHangID}</td>
                <td>
                  {c.NgayKy
                    ? new Date(c.NgayKy).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td>
                  {c.NgayHetHan
                    ? new Date(c.NgayHetHan).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td>{c.LoaiDichVu}</td>
                <td>{c.GiaTri.toLocaleString("vi-VN")}</td>
                <td>{c.TrangThai}</td>

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
                      handleDelete(c.HopDongID);
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
            <h3>{isEdit ? "✏️ Sửa hợp đồng" : "➕ Thêm hợp đồng"}</h3>

            <label>Khách hàng *</label>
            <select
              name="KhachHangID"
              value={form.KhachHangID}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn khách hàng --</option>
              {khachHangs.map((kh) => (
                <option key={kh.KhachHangID} value={kh.KhachHangID}>
                  {kh.TenKH} - {kh.SDT}
                </option>
              ))}
            </select>

            <label>Ngày ký *</label>
            <input
              type="date"
              name="NgayKy"
              value={form.NgayKy}
              onChange={handleChange}
              required
            />

            <label>Ngày hết hạn</label>
            <input
              type="date"
              name="NgayHetHan"
              value={form.NgayHetHan}
              onChange={handleChange}
            />

            <label>Loại dịch vụ</label>
            <input
              name="LoaiDichVu"
              placeholder="Ví dụ: Vận chuyển container, Lưu kho..."
              value={form.LoaiDichVu}
              onChange={handleChange}
            />

            <label>Giá trị (VNĐ) *</label>
            <input
              type="number"
              name="GiaTri"
              placeholder="Nhập giá trị hợp đồng"
              value={form.GiaTri}
              onChange={handleChange}
              required
            />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Hết hạn">Hết hạn</option>
              <option value="Chấm dứt">Chấm dứt</option>
              <option value="Chuẩn bị">Chuẩn bị</option>
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

export default Contracts;