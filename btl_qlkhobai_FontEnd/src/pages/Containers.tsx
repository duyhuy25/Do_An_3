import React, { useEffect, useState } from "react";
import "./Containers.css";

interface Container {
  ContainerID: number;
  LoaiHang: string;
  TrongLuong: number;
  TrangThai: string;
  Kho: string;
  PhuongTien: string;
  HopDong: string;
}

const Containers = () => {

  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/containers")
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
              <td>{c.LoaiHang}</td>
              <td>{c.TrongLuong} kg</td>
              <td>{c.TrangThai}</td>
              <td>{c.Kho}</td>
              <td>{c.PhuongTien}</td>
              <td>{c.HopDong}</td>

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