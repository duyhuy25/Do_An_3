import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Invoice {
  HoaDonID: number;
  HopDongID: number;
  SoTien: number;
  NgayLap: string;
}

interface Cost {
  ChiPhiID: number;
  SoTien: number;
}

const Dashboard: React.FC = () => {

  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongChiPhi, setTongChiPhi] = useState(0);

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {

    const fetchData = async () => {

      const invoices: Invoice[] = await fetch("http://localhost:5000/api/invoice/invoice")
        .then(res => res.json());

      const costs: Cost[] = await fetch("http://localhost:5000/api/cost/cost")
        .then(res => res.json());

      const totalRevenue = invoices.reduce((sum, i) => sum + i.SoTien, 0);
      const totalCost = costs.reduce((sum, c) => sum + c.SoTien, 0);

      setTongDoanhThu(totalRevenue);
      setTongChiPhi(totalCost);

      const monthMap: any = {};
      const yearMap: any = {};

      invoices.forEach(i => {
        const date = new Date(i.NgayLap);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const monthKey = `${year}-${month}`;

        if (!monthMap[monthKey]) monthMap[monthKey] = 0;
        if (!yearMap[year]) yearMap[year] = 0;

        monthMap[monthKey] += i.SoTien;
        yearMap[year] += i.SoTien;
      });

      const monthArr = Object.keys(monthMap).map(k => ({
        thang: k,
        doanhThu: monthMap[k]
      }));

      const yearArr = Object.keys(yearMap).map(k => ({
        nam: k,
        doanhThu: yearMap[k]
      }));

      setMonthlyData(monthArr);
      setYearlyData(yearArr);
    };

    fetchData();

  }, []);

  const loiNhuan = tongDoanhThu - tongChiPhi;

  const filteredMonth = monthlyData.filter(m =>
    yearFilter === "all" ? true : m.thang.startsWith(yearFilter)
  );

  return (
    <div>

      <div className="header">
        <h2>📊 Báo cáo thống kê</h2>
      </div>

      <div className="dashboard">

        <div className="card">
          <h4>💰 Tổng doanh thu</h4>
          <p>{tongDoanhThu.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>💸 Tổng chi phí</h4>
          <p>{tongChiPhi.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>📈 Lợi nhuận</h4>
          <p>{loiNhuan.toLocaleString()} VNĐ</p>
        </div>

      </div>

      <div style={{ margin: "20px 0" }}>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="all">Tất cả năm</option>
          {yearlyData.map((y, index) => (
            <option key={index} value={y.nam}>{y.nam}</option>
          ))}
        </select>
      </div>

      <h3>📅 Doanh thu theo tháng</h3>

      <table>
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Doanh thu</th>
          </tr>
        </thead>

        <tbody>
          {filteredMonth.map((m, index) => (
            <tr key={index}>
              <td>{m.thang}</td>
              <td>{m.doanhThu.toLocaleString()} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "30px" }}>📆 Doanh thu theo năm</h3>

      <table>
        <thead>
          <tr>
            <th>Năm</th>
            <th>Doanh thu</th>
          </tr>
        </thead>

        <tbody>
          {yearlyData.map((y, index) => (
            <tr key={index}>
              <td>{y.nam}</td>
              <td>{y.doanhThu.toLocaleString()} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Dashboard;