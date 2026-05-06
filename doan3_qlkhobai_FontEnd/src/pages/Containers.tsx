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

  MaContainer: string;
  KichThuoc: string;
  LoaiContainer: string;
  NgayDongHang: string | null;
  NgayMoHang: string | null;
  TinhTrangVo: string;
  NhietDoBaoQuan: number | null;
  DoAm: number | null;
}

interface LoaiHangOption { LoaiHangID: number; TenLoai: string; }
interface KhoOption { KhoID: number; TenKho: string; }
interface PhuongTienOption { PhuongTienID: number; BienSo: string; TrangThai: string; }
interface HopDongOption { HopDongID: number; MaHopDong?: string; }

const Containers: React.FC = () => {

  const [containers, setContainers] = useState<Container[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [loaiHangs, setLoaiHangs] = useState<LoaiHangOption[]>([]);
  const [khos, setKhos] = useState<KhoOption[]>([]);
  const [phuongTiens, setPhuongTiens] = useState<PhuongTienOption[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);
  const [latestGps, setLatestGps] = useState<any[]>([]);

  const [chuyenDis, setChuyenDis] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);

  const [wfAction, setWfAction] = useState<{ type: string, container: Container } | null>(null);
  const [wfForm, setWfForm] = useState({ khoId: "", chuyenDiId: "", phuongTienId: "" });

  const [form, setForm] = useState({
    LoaiHangID: "",
    TrongLuong: "",
    TrangThai: "Rỗng",
    KhoID: "",
    PhuongTienID: "",
    HopDongID: "",

    MaContainer: "",
    KichThuoc: "",
    LoaiContainer: "",
    NgayDongHang: "",
    NgayMoHang: "",
    TinhTrangVo: "",
    NhietDoBaoQuan: "",
    DoAm: "",
  });

  const fetchContainers = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/container/container/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/container/container";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải container");
      const data = await res.json();
      setContainers(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const [lh, k, pt, hd, cd, gps] = await Promise.all([
        fetch("http://localhost:5000/api/itemtype/itemtype").then(res => res.json()),
        fetch("http://localhost:5000/api/warehouse/warehouse").then(res => res.json()),
        fetch("http://localhost:5000/api/vehicle/vehicle").then(res => res.json()),
        fetch("http://localhost:5000/api/contract/contract").then(res => res.json()),
        fetch("http://localhost:5000/api/trip/trip").then(res => res.json()),
        fetch("http://localhost:5000/api/latest").then(res => res.json())
      ]);

      setLoaiHangs(lh);
      setKhos(k);
      setPhuongTiens(pt);
      setHopDongs(hd);
      setChuyenDis(cd);
      setLatestGps(gps);

    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchContainers(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchContainers]);

  useEffect(() => {
    setLoading(true);
    fetchOptions().finally(() => setLoading(false));
  }, [fetchOptions]);

  const formatID = (id: number) => "CTN" + id.toString().padStart(3, "0");

  const executeWorkflow = async (url: string, payload: any = {}) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, nguoiCapNhat: currentUser.HoTen || currentUser.Username || "Quản lý", UserID: currentUser.UserID })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi xử lý");
      alert(data.message || "Thành công!");
      fetchContainers(search);
      setWfAction(null);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleSimpleWorkflow = (action: string, id: number) => {
    executeWorkflow(`http://localhost:5000/api/workflow/${action}/${id}`, { UserID: currentUser.UserID });
  };

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
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

      MaContainer: "",
      KichThuoc: "",
      LoaiContainer: "",
      NgayDongHang: "",
      NgayMoHang: "",
      TinhTrangVo: "",
      NhietDoBaoQuan: "",
      DoAm: "",
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
      KhoID: item.KhoID?.toString() || "",
      PhuongTienID: item.PhuongTienID?.toString() || "",
      HopDongID: item.HopDongID.toString(),

      MaContainer: item.MaContainer || "",
      KichThuoc: item.KichThuoc || "",
      LoaiContainer: item.LoaiContainer || "",
      NgayDongHang: item.NgayDongHang?.slice(0, 10) || "",
      NgayMoHang: item.NgayMoHang?.slice(0, 10) || "",
      TinhTrangVo: item.TinhTrangVo || "",
      NhietDoBaoQuan: item.NhietDoBaoQuan?.toString() || "",
      DoAm: item.DoAm?.toString() || "",
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.LoaiHangID || !form.HopDongID || !form.TrongLuong) {
      alert("Thiếu dữ liệu bắt buộc (Loại hàng, Hợp đồng, Trọng lượng)!");
      return;
    }

    if (Number(form.TrongLuong) <= 0) {
      alert("Trọng lượng phải lớn hơn 0!");
      return;
    }

    if (form.NhietDoBaoQuan && isNaN(Number(form.NhietDoBaoQuan))) {
      alert("Nhiệt độ bảo quản phải là số!");
      return;
    }

    if (form.DoAm && (Number(form.DoAm) < 0 || Number(form.DoAm) > 100)) {
      alert("Độ ẩm phải từ 0 đến 100%!");
      return;
    }

    const body = {
      LoaiHangID: Number(form.LoaiHangID),
      TrongLuong: Number(form.TrongLuong),
      TrangThai: form.TrangThai,
      HopDongID: Number(form.HopDongID),
      KhoID: form.KhoID ? Number(form.KhoID) : null,
      PhuongTienID: form.PhuongTienID ? Number(form.PhuongTienID) : null,

      MaContainer: form.MaContainer || null,
      KichThuoc: form.KichThuoc || null,
      LoaiContainer: form.LoaiContainer || null,
      NgayDongHang: form.NgayDongHang || null,
      NgayMoHang: form.NgayMoHang || null,
      TinhTrangVo: form.TinhTrangVo || null,
      NhietDoBaoQuan: form.NhietDoBaoQuan ? Number(form.NhietDoBaoQuan) : null,
      DoAm: form.DoAm ? Number(form.DoAm) : null,
      UserID: currentUser.UserID
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/container/container/${selected.ContainerID}`
        : "http://localhost:5000/api/container/addcontainer";

      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      setShowForm(false);
      fetchContainers(search);

    } catch (err) {
      alert("Lỗi lưu dữ liệu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa container này?")) return;

    await fetch(`http://localhost:5000/api/container/container/${id}?userId=${currentUser.UserID}`, {
      method: "DELETE"
    });

    fetchContainers(search);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📦 Container</h2>

        <div className="toolbar">
          <input
            className="search"
            placeholder="Tìm..."
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
            <th>Mã</th>
            <th>Loại hàng</th>
            <th>Trọng lượng</th>
            <th>Kích thước</th>
            <th>Loại container</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>Phương tiện</th>
            <th>Hợp đồng</th>
            <th>Ngày đóng</th>
            <th>Ngày mở</th>
            <th>Tình trạng vỏ</th>
            <th>Nhiệt độ</th>
            <th>Độ ẩm</th>
            <th>Vị trí GPS</th>
            <th>Điều phối</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {containers.map((c) => {
            const gps = latestGps.find(g => g.ContainerID === c.ContainerID);
            const isOverspeed = gps && gps.TocDo > 80;

            return (
              <tr key={c.ContainerID} onClick={() => handleOpenEdit(c)}>
                <td>{formatID(c.ContainerID)}</td>
                <td>{c.MaContainer || "-"}</td>

                <td>
                  {loaiHangs.find(l => l.LoaiHangID === c.LoaiHangID)?.TenLoai}
                </td>

                <td>{c.TrongLuong?.toLocaleString("vi-VN")}</td>
                <td>{c.KichThuoc || "-"}</td>
                <td>{c.LoaiContainer || "-"}</td>

                <td>{c.TrangThai}</td>

                <td>{khos.find(k => k.KhoID === c.KhoID)?.TenKho || "-"}</td>

                <td>
                  {phuongTiens.find(p => p.PhuongTienID === c.PhuongTienID)?.BienSo || "-"}
                </td>

                <td>
                  {hopDongs.find(h => h.HopDongID === c.HopDongID)?.MaHopDong || c.HopDongID}
                </td>

                <td>{c.NgayDongHang ? c.NgayDongHang.slice(0, 10) : "-"}</td>
                <td>{c.NgayMoHang ? c.NgayMoHang.slice(0, 10) : "-"}</td>
                <td>{c.TinhTrangVo || "-"}</td>
                <td>{c.NhietDoBaoQuan ?? "-"}</td>
                <td>{c.DoAm ?? "-"}</td>

                <td>
                  {gps ? (
                    <div style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                      <a 
                        href={`https://www.google.com/maps?q=${gps.ViDo},${gps.KinhDo}`} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ textDecoration: 'none', color: '#007bff' }}
                        title="Xem trên bản đồ"
                      >
                        📍 {gps.ViDo.toFixed(4)}, {gps.KinhDo.toFixed(4)}
                      </a>
                      <br />
                      ⚡ <span style={{ 
                        color: isOverspeed ? 'red' : '#28a745', 
                        fontWeight: isOverspeed ? 'bold' : 'normal',
                        backgroundColor: isOverspeed ? '#fff5f5' : 'transparent',
                        padding: isOverspeed ? '2px 4px' : '0',
                        borderRadius: '3px'
                      }}>
                        {gps.TocDo} km/h {isOverspeed && "⚠️"}
                      </span>
                    </div>
                  ) : "-"}
                </td>

                <td className="actions">
                  <div className="td-actions" style={{ flexDirection: 'column', gap: '5px' }}>
                    {c.TrangThai === "Rỗng" && (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleSimpleWorkflow("start-packing", c.ContainerID); }}>Bắt đầu đóng hàng</button>
                    )}
                    {c.TrangThai === "Đang đóng hàng" && (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleSimpleWorkflow("finish-packing", c.ContainerID); }}>Hoàn tất đóng hàng</button>
                    )}
                    {c.TrangThai === "Đã đóng hàng" && (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); setWfAction({ type: "enter-warehouse", container: c }); setWfForm({ ...wfForm, khoId: "" }); }}>Nhập kho</button>
                    )}
                    {(c.TrangThai === "Trong kho" || c.TrangThai === "Đã đóng hàng") && (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); setWfAction({ type: "start-transport", container: c }); setWfForm({ ...wfForm, chuyenDiId: "", phuongTienId: "" }); }}>Vận chuyển</button>
                    )}
                    {c.TrangThai === "Đang vận chuyển" && (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleSimpleWorkflow("vehicle-arrived", c.ContainerID); }}>Đã đến nơi</button>
                    )}
                    {c.TrangThai === "Đã đến nơi" && (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleSimpleWorkflow("deliver-container", c.ContainerID); }}>Đã giao</button>
                    )}
                    {c.TrangThai !== "Đã giao" && c.TrangThai !== "Hủy" && (
                      <button className="btn-delete" onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Bạn có chắc chắn muốn hủy đơn (Container) này không?')) {
                          handleSimpleWorkflow("cancel-container", c.ContainerID);
                        }
                      }}>Hủy đơn</button>
                    )}
                  </div>
                </td>

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
                        handleDelete(c.ContainerID);
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

            <h3>{isEdit ? "Sửa" : "Thêm"} Container</h3>

            <div className="form-group">
              <label>Loại hàng *</label>
              <select name="LoaiHangID" value={form.LoaiHangID} onChange={handleChange}>
                <option value="">-- Chọn loại hàng --</option>
                {loaiHangs.map(l => (
                  <option key={l.LoaiHangID} value={l.LoaiHangID}>
                    {l.TenLoai}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hợp đồng *</label>
              <select name="HopDongID" value={form.HopDongID} onChange={handleChange}>
                <option value="">-- Chọn hợp đồng --</option>
                {hopDongs.map(h => (
                  <option key={h.HopDongID} value={h.HopDongID}>
                    {h.MaHopDong || h.HopDongID}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Kho</label>
              <select name="KhoID" value={form.KhoID} onChange={handleChange}>
                <option value="">-- Chọn kho --</option>
                {khos.map(k => (
                  <option key={k.KhoID} value={k.KhoID}>
                    {k.TenKho}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Phương tiện</label>
              <select name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange}>
                <option value="">-- Chọn phương tiện --</option>
                {phuongTiens.map(p => (
                  <option key={p.PhuongTienID} value={p.PhuongTienID}>
                    {p.BienSo} - {p.TrangThai}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select name="TrangThai" value={form.TrangThai} onChange={handleChange} disabled={isEdit}>
                <option value="Rỗng">Rỗng</option>
                <option value="Đang đóng hàng">Đang đóng hàng</option>
                <option value="Đã đóng hàng">Đã đóng hàng</option>
                <option value="Trong kho">Trong kho</option>
                <option value="Đã phân công">Đã phân công</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Đã đến nơi">Đã đến nơi</option>
                <option value="Đã giao">Đã giao</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mã container</label>
              <input name="MaContainer" value={form.MaContainer} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Loại container</label>
              <input name="LoaiContainer" value={form.LoaiContainer} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Kích thước</label>
              <input name="KichThuoc" value={form.KichThuoc} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Trọng lượng *</label>
              <input type="number" name="TrongLuong" value={form.TrongLuong} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Ngày đóng hàng</label>
              <input type="date" name="NgayDongHang" value={form.NgayDongHang} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Ngày mở hàng</label>
              <input type="date" name="NgayMoHang" value={form.NgayMoHang} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Tình trạng vỏ</label>
              <input name="TinhTrangVo" value={form.TinhTrangVo} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Nhiệt độ bảo quản (°C)</label>
              <input type="number" name="NhietDoBaoQuan" value={form.NhietDoBaoQuan} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Độ ẩm (%)</label>
              <input type="number" name="DoAm" value={form.DoAm} onChange={handleChange} />
            </div>

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

      {wfAction && (
        <div className="modal">
          <div className="modal-content">
            <h3>Điều phối Container {formatID(wfAction.container.ContainerID)}</h3>

            {wfAction.type === "enter-warehouse" && (
              <>
                <label>Chọn kho lưu trữ *</label>
                <select value={wfForm.khoId} onChange={(e) => setWfForm({ ...wfForm, khoId: e.target.value })}>
                  <option value="">-- Chọn kho --</option>
                  {khos.filter(k => k.TenKho).map(k => (
                    <option key={k.KhoID} value={k.KhoID}>{k.TenKho}</option>
                  ))}
                </select>
              </>
            )}

            {wfAction.type === "start-transport" && (
              <>
                <label>Chọn chuyến đi *</label>
                <select value={wfForm.chuyenDiId} onChange={(e) => setWfForm({ ...wfForm, chuyenDiId: e.target.value })}>
                  <option value="">-- Chọn chuyến đi --</option>
                  {chuyenDis.filter(cd => cd.TrangThai !== "Hoàn thành" && cd.TrangThai !== "Hủy" && cd.TrangThai !== "Đang chạy").map(cd => (
                    <option key={cd.ChuyenDiID} value={cd.ChuyenDiID}>{cd.MaChuyen} - {cd.TrangThai}</option>
                  ))}
                </select>

                <label>Chọn phương tiện *</label>
                <select value={wfForm.phuongTienId} onChange={(e) => setWfForm({ ...wfForm, phuongTienId: e.target.value })}>
                  <option value="">-- Chọn phương tiện --</option>
                  {phuongTiens.filter(pt => pt.TrangThai === "Sẵn sàng").map(pt => (
                    <option key={pt.PhuongTienID} value={pt.PhuongTienID}>{pt.BienSo} - {pt.TrangThai}</option>
                  ))}
                </select>
              </>
            )}

            <div className="modal-actions">
              <button className="btn-submit" onClick={() => {
                const url = `http://localhost:5000/api/workflow/${wfAction.type}/${wfAction.container.ContainerID}`;
                let payload: any = {};
                if (wfAction.type === "enter-warehouse") {
                  if (!wfForm.khoId) return alert("Vui lòng chọn kho!");
                  payload = { khoId: Number(wfForm.khoId) };
                } else if (wfAction.type === "start-transport") {
                  if (!wfForm.chuyenDiId || !wfForm.phuongTienId) return alert("Vui lòng chọn chuyến đi và phương tiện!");

                  const originalVehicleId = wfAction.container.PhuongTienID;
                  const newVehicleId = Number(wfForm.phuongTienId);

                  if (originalVehicleId && originalVehicleId !== newVehicleId) {
                    const confirmChange = window.confirm("Bạn muốn chuyển sang phương tiện này?");
                    if (!confirmChange) return;
                  }

                  payload = {
                    chuyenDiId: Number(wfForm.chuyenDiId),
                    phuongTienId: newVehicleId,
                    khoIdCu: wfAction.container.KhoID
                  };
                }
                executeWorkflow(url, payload);
              }}>Xác nhận</button>
              <button className="btn-cancel" onClick={() => setWfAction(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Containers;