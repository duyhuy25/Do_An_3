import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Cost {
  ChiPhiID: number;
  HopDongID: number;
  ContainerID: number | null;
  LoaiChiPhi: string;
  SoTien: number;
  ThuKhachHang: string;
  NhaCungCap?: string;
}

interface SupplierOption {
  NCCID: number;
  TenNCC: string;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
  TenKH?: string;
}

interface ContainerOption {
  ContainerID: number;
  HopDongID: number;
  formattedID: string;
}

const Costs: React.FC = () => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);

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
    NhaCungCap: "",
  });

  const fetchCosts = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/cost/cost/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/cost/cost";

      const res = await fetch(url);
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
      const res = await fetch("http://localhost:5000/api/contract/contract");
      const data = await res.json();
      setHopDongs(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();

      const formatted = data.map((c: any) => ({
        ContainerID: c.ContainerID,
        HopDongID: c.HopDongID,
        formattedID: "CTN" + c.ContainerID.toString().padStart(3, "0"),
      }));

      setContainers(formatted);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/supplier");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCosts(), fetchHopDongs(), fetchContainers(), fetchSuppliers()]).finally(() => setLoading(false));
  }, [fetchCosts, fetchHopDongs, fetchContainers, fetchSuppliers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCosts(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchCosts]);

  const formatID = (id: number) => "CP" + id.toString().padStart(3, "0");

  const hopDongMap = Object.fromEntries(
    hopDongs.map((h) => [h.HopDongID, h])
  );

  const containerMap = Object.fromEntries(
    containers.map((c) => [c.ContainerID, c])
  );

  const formatSupplier = (nccValue: string | undefined) => {
    if (!nccValue) return "-";
    const ncc = suppliers.find(s => s.NCCID.toString() === nccValue || s.TenNCC === nccValue);
    return ncc ? ncc.TenNCC : nccValue;
  };

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
      NhaCungCap: "",
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
      NhaCungCap: item.NhaCungCap || "",
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
      alert("Số tiền phải là số dương");
      return;
    }

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      ContainerID: form.ContainerID ? Number(form.ContainerID) : null,
      SoTien: Number(form.SoTien),
    };

    try {
      let res: Response;
      if (isEdit && selected) {
        res = await fetch(
          `http://localhost:5000/api/cost/cost/${selected.ChiPhiID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/cost/addcost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error("Lỗi server");

      setShowForm(false);
      fetchCosts(search);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu chi phí");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cost/cost/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      fetchCosts(search);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa");
    }
  };

  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      {loading && <div className="loading">Đang tải dữ liệu...</div>}
      <div className="header">
        <h2>💰 Danh sách chi phí</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm chi phí..."
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
            <th>Hợp đồng</th>
            <th>Container</th>
            <th>Nhà cung cấp</th>
            <th>Loại chi phí</th>
            <th>Số tiền</th>
            <th>Thu KH</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {costs
            .filter(c => c.HopDongID !== null) // Chỉ hiển thị chi phí có hợp đồng (Khách hàng)
            .map((c) => {
              const hd = hopDongMap[c.HopDongID];

              return (
                <tr key={c.ChiPhiID} onClick={() => handleOpenEdit(c)}>
                  <td>{formatID(c.ChiPhiID)}</td>
                  <td>
                    {hd
                      ? hd.MaHopDong || `HD${hd.HopDongID}`
                      : c.HopDongID}
                  </td>
                  <td>
                    {c.ContainerID && containerMap[c.ContainerID]
                      ? containerMap[c.ContainerID].formattedID
                      : containers
                        .filter((ct) => ct.HopDongID === c.HopDongID)
                        .map((ct) => ct.formattedID)
                        .join(", ") || "-"}
                  </td>
                  <td>{formatSupplier(c.NhaCungCap)}</td>
                  <td>{c.LoaiChiPhi}</td>
                  <td>{c.SoTien.toLocaleString("vi-VN")} đ</td>
                  <td>{c.ThuKhachHang}</td>

                  <td className="actions">
                    <div className="td-actions">
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
                    </div>
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
            >
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID}`}
                </option>
              ))}
            </select>

            <label>Container</label>
            <select
              name="ContainerID"
              value={form.ContainerID}
              onChange={handleChange}
            >
              <option value="">-- Không chọn --</option>
              {containers
                .filter((ct) => !form.HopDongID || ct.HopDongID === Number(form.HopDongID))
                .map((ct) => (
                  <option key={ct.ContainerID} value={ct.ContainerID}>
                    {ct.formattedID}
                  </option>
                ))}
            </select>

            <label>Nhà cung cấp (Đối tác chi trả)</label>
            <select
              name="NhaCungCap"
              value={form.NhaCungCap}
              onChange={handleChange}
            >
              <option value="">-- Tự chi trả / Khác --</option>
              {suppliers.map(s => (
                <option key={s.NCCID} value={s.NCCID.toString()}>
                  {s.TenNCC}
                </option>
              ))}
            </select>

            <label>Loại chi phí *</label>
            <input
              name="LoaiChiPhi"
              value={form.LoaiChiPhi}
              onChange={handleChange}
              placeholder="Ví dụ: Phí cầu đường, Phí nâng hạ..."
            />

            <label>Số tiền *</label>
            <input
              type="number"
              name="SoTien"
              value={form.SoTien}
              onChange={handleChange}
            />

            <label>Thu khách hàng</label>
            <select
              name="ThuKhachHang"
              value={form.ThuKhachHang}
              onChange={handleChange}
            >
              <option value="Không">Không (Chi phí vận hành)</option>
              <option value="Có">Có (Sẽ cộng vào hóa đơn khách)</option>
            </select>

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

export default Costs;