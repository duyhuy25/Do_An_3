import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Container {
  ContainerID: number;
  HopDongID: number;
  LoaiHangID: string;
  TrongLuong: number;
  TrangThai: string;
  KhoID: string;
  PhuongTienID: string;
  ChuyenDiID: string;
}

interface ItemType {
  LoaiHangID: string;
  TenLoai: string;
}

interface Vehicle {
  PhuongTienID: string;
  BienSo: string;
}

const Containers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  // 🔹 LOAD DATA
  const fetchData = async () => {
    try {
      const res1 = await fetch("http://localhost:5000/api/container/container");
      const data1 = await res1.json();
      setContainers(data1);

      const res2 = await fetch("http://localhost:5000/api/itemtype/itemtype");
      const data2 = await res2.json();
      setItemTypes(data2);

      const res3 = await fetch("http://localhost:5000/api/vehicle/vehicle");
      const data3 = await res3.json();
      setVehicles(data3);
    } catch (error) {
      console.error("Lỗi load dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) => {
    return "CTN" + id.toString().padStart(3, "0");
  };

  const getLoaiHangName = (id: string) => {
    const found = itemTypes.find(x => x.LoaiHangID === id);
    return found ? found.TenLoai : id;
  };

  const getBienSo = (id: string) => {
    const found = vehicles.find(x => x.PhuongTienID === id);
    return found ? found.BienSo : id;
  };

  const handleAdd = async () => {
    const newItem = {
      LoaiHangID: "LH01",
      TrongLuong: 1000,
      TrangThai: "Mới",
      KhoID: "KHO01",
      PhuongTienID: "XE01",
      HopDongID: 1,
      ChuyenDiID: "CD01"
    };

    try {
      await fetch("http://localhost:5000/api/container/container", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      });

      fetchData();

    } catch (error) {
      console.error("Lỗi thêm:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;

    try {
      await fetch(`http://localhost:5000/api/container/container/${id}`, {
        method: "DELETE"
      });

      fetchData();
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  const filteredContainers = containers.filter(c =>
    formatID(c.ContainerID).includes(search) ||
    getLoaiHangName(c.LoaiHangID).toLowerCase().includes(search.toLowerCase()) ||
    getBienSo(c.PhuongTienID).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h2>📦 Danh sách Container</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleAdd}>
            + Thêm container
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại hàng</th>
            <th>Trọng lượng</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>Phương tiện</th>
            <th>Hợp đồng</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredContainers.map((c) => (
            <tr key={c.ContainerID}>
              <td>{formatID(c.ContainerID)}</td>
              <td>{getLoaiHangName(c.LoaiHangID)}</td>
              <td>{c.TrongLuong} kg</td>
              <td>{c.TrangThai}</td>
              <td>{c.KhoID}</td>
              <td>{getBienSo(c.PhuongTienID)}</td>
              <td>{c.HopDongID}</td>

              <td>
                <button className="btn-edit">Sửa</button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(c.ContainerID)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Containers;