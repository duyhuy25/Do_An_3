import React, { useEffect, useState, useCallback } from "react";
import "./Pages.css";

interface AuditLog {
  LogID: number;
  UserID: number;
  HanhDong: string;
  Bang: string;
  ThoiGian: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/audit/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/audit";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải log");

      const data = await res.json();
      setLogs(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLogs(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchLogs]);

  useEffect(() => {
    setLoading(true);
    fetchLogs().finally(() => setLoading(false));
  }, [fetchLogs]);

  const formatUser = (id: number) =>
    "USR" + id.toString().padStart(3, "0");

  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT": return "green";
      case "UPDATE": return "orange";
      case "DELETE": return "red";
      default: return "gray";
    }
  };

  if (loading) return <div className="loading">Đang tải log...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📜 Audit Log</h2>
        <div className="toolbar">
          <input
            className="search"
            placeholder="🔍 Tìm theo user, bảng, hành động..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Hành động</th>
            <th>Bảng</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.LogID}>
              <td>{l.LogID}</td>
              <td>{formatUser(l.UserID)}</td>
              <td style={{ color: getActionColor(l.HanhDong), fontWeight: "bold" }}>
                {l.HanhDong}
              </td>
              <td>{l.Bang}</td>
              <td>{new Date(l.ThoiGian).toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;