import React, { useEffect, useState } from "react";
import "./Pages.css";

interface ItemType {
  LoaiHangID: number;
  TenLoai: string;
  DanhMuc: string;
  MoTa: string;
}

const ItemTypes: React.FC = () => {

  const [types, setTypes] = useState<ItemType[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);

  const [form, setForm] = useState({
    TenLoai: "",
    DanhMuc: "",
    MoTa: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/itemtype/itemtype");
    const data = await res.json();
    setTypes(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "LH" + id.toString().padStart(3, "0");

  const filtered = types.filter((t) =>
    t.TenLoai.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      TenLoai: "",
      DanhMuc: "",
      MoTa: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: ItemType) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      TenLoai: item.TenLoai,
      DanhMuc: item.DanhMuc,
      MoTa: item.MoTa
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = { ...form };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/itemtype/itemtype/${selected.LoaiHangID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/itemtype/itemtype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`http://localhost:5000/api/itemtype/itemtype/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>📂 Danh sách loại hàng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm loại hàng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm loại hàng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên loại hàng</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t.LoaiHangID} onClick={() => handleOpenEdit(t)}>
              <td>{formatID(t.LoaiHangID)}</td>
              <td>{t.TenLoai}</td>
              <td>{t.DanhMuc}</td>
              <td>{t.MoTa}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(t);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.LoaiHangID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} loại hàng</h3>

            <input name="TenLoai" placeholder="Tên loại hàng" value={form.TenLoai} onChange={handleChange} />
            <input name="DanhMuc" placeholder="Danh mục" value={form.DanhMuc} onChange={handleChange} />
            <input name="MoTa" placeholder="Mô tả" value={form.MoTa} onChange={handleChange} />

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

export default ItemTypes;