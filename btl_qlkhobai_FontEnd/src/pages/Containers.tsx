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

const Containers = () => {

  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/container/container")
      .then(res => res.json())
      .then(data => setContainers(data))
      .catch(err => console.error(err));

  }, []);

  return (

    <div>

      <h2>📦 Danh sách Container</h2>

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

          {containers.map((c) => (

            <tr key={c.ContainerID}>
              <td>{c.ContainerID}</td>
              <td>{c.HopDongID}</td>
              <td>{c.LoaiHangID}</td>
              <td>{c.TrongLuong} kg</td>
              <td>{c.TrangThai}</td>
              <td>{c.KhoID}</td>
              <td>{c.PhuongTienID}</td>

              <td>
                <button className="btn-edit">Sửa</button>
                <button className="btn-delete">Xóa</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default Containers;