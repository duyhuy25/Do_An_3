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

  const [revenueToday, setRevenueToday] = useState(0);
  const [costToday, setCostToday] = useState(0);
  const [contractsToday, setContractsToday] = useState(0);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalInternalCost, setTotalInternalCost] = useState(0);

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {

    const fetchData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];

        const invoicesRes = await fetch("http://localhost:5000/api/invoice/invoice");
        if (!invoicesRes.ok) throw new Error("Lỗi tải hóa đơn");
        const invoices: Invoice[] = await invoicesRes.json();

        const costsRes = await fetch("http://localhost:5000/api/cost/cost");
        if (!costsRes.ok) throw new Error("Lỗi tải chi phí");
        const costs: any[] = await costsRes.json();

        const contractsRes = await fetch("http://localhost:5000/api/contract/contract");
        if (!contractsRes.ok) throw new Error("Lỗi tải hợp đồng");
        const contracts: any[] = await contractsRes.json();

        // Today Stats
        const revToday = invoices
          .filter(i => i.NgayLap && i.NgayLap.split('T')[0] === todayStr)
          .reduce((sum, i) => sum + i.SoTien, 0);

        const cToday = costs
          .filter(c => c.NgayPhatSinh && c.NgayPhatSinh.split('T')[0] === todayStr)
          .reduce((sum, c) => sum + c.SoTien, 0);

        const contToday = contracts
          .filter(h => h.NgayKy && h.NgayKy.split('T')[0] === todayStr)
          .length;

        // All Time Stats
        const totalRev = invoices.reduce((sum, i) => sum + i.SoTien, 0);
        const totalC = costs.reduce((sum, c) => sum + c.SoTien, 0);
        const internalC = costs
          .filter(c => c.ThuKhachHang === "Không")
          .reduce((sum, c) => sum + c.SoTien, 0);

        setRevenueToday(revToday);
        setCostToday(cToday);
        setContractsToday(contToday);
        
        setTotalRevenue(totalRev);
        setTotalCost(totalC);
        setTotalInternalCost(internalC);

        const monthMap: any = {};
        const yearMap: any = {};

        invoices.forEach(i => {
          if (!i.NgayLap) return;
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
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };

    fetchData();

  }, []);

  const filteredMonth = monthlyData.filter(m =>
    yearFilter === "all" ? true : m.thang.startsWith(yearFilter)
  );

  return (
    <div>

      <div className="header">
        <h2>📊 Báo cáo thống kê</h2>
      </div>

      <h3 style={{ marginBottom: "15px" }}>📅 Thống kê hôm nay</h3>
      <div className="dashboard" style={{ marginBottom: "30px" }}>
        <div className="card">
          <h4>💰 Doanh thu hôm nay</h4>
          <p>{revenueToday.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>💸 Chi phí hôm nay</h4>
          <p>{costToday.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>📄 Hợp đồng mới</h4>
          <p>{contractsToday} Hợp đồng</p>
        </div>
      </div>

      <h3 style={{ marginBottom: "15px" }}>🌍 Thống kê tổng thể</h3>
      <div className="dashboard" style={{ marginBottom: "30px" }}>
        <div className="card">
          <h4>📊 Tổng doanh thu</h4>
          <p>{totalRevenue.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>📉 Tổng chi phí</h4>
          <p>{totalCost.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>🏢 Chi phí nội bộ (Không thu KH)</h4>
          <p style={{ color: "#e74c3c" }}>{totalInternalCost.toLocaleString()} VNĐ</p>
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